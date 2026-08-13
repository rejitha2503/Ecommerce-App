import { Router, Response } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../auth';
import { getCloudinarySignature, uploadToServerSideCloudinary } from '../cloudinary';

const router = Router();

/**
 * @route   POST /api/uploads/signature
 * @desc    Generates signed upload policies enabling the client's browser to upload pictures directly to Cloudinary safely
 */
router.post('/signature', requireAuth, requireRole(['SELLER', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { folder } = req.body;

  try {
    const signatureDetails = getCloudinarySignature(folder || 'shopsphere_products');
    res.json(signatureDetails);
  } catch (err: any) {
    console.error('Cloudinary Signature Generation Fault:', err);
    res.status(500).json({ 
      error: 'Cloudinary signature generation failed. Ensure CLOUDINARY environmental settings are initialized.' 
    });
  }
});

/**
 * @route   POST /api/uploads/server-proxy
 * @desc    Accepts brief Base64 parameters to execute simple raw direct server-side uploads (Alternative proxy method)
 */
router.post('/server-proxy', requireAuth, requireRole(['SELLER', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { blockBase64, folder } = req.body;

  if (!blockBase64) {
    return res.status(400).json({ error: 'Missing core base64 photo parameter.' });
  }

  try {
    const photoUrl = await uploadToServerSideCloudinary(blockBase64, folder || 'shopsphere_products');
    res.json({ url: photoUrl });
  } catch (err: any) {
    console.error('Cloudinary Local Proxy upload fault:', err);
    res.status(500).json({ 
      error: 'Direct proxy upload aborted. Database or network interface offline.' 
    });
  }
});

export default router;
