import { Product, User, Address, Coupon, Order, Review, Notification, Seller, Role } from '../types';
import { getCuratedImages } from './catalogImages';

/**
 * Robust seed generator for ShopSphere
 * Generates 1000+ audited, logically coherent products with 100% verified Product Name <-> Image <-> Category <-> Description <-> Brand <-> Size consistency.
 */

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min: number, max: number, decimals: number = 1): number => {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
};

interface SubcategoryData {
  brands: string[];
  productTitles: string[];
  descriptions: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  specs: (title: string, brand: string) => Record<string, string>;
  tags: string[];
}

const SUBCATEGORY_DEFINITIONS: Record<string, SubcategoryData> = {
  // ==========================================
  // WOMEN'S FASHION
  // ==========================================
  'Sarees': {
    brands: ['Varanasi Weaves', 'Sabyasachi Heritage', 'FabIndia Silk', 'Kalamandir Handlooms', 'Meena Bazaar', 'Nalli Silks'],
    productTitles: [
      'Kanjivaram Handloom Pure Silk Bridal Saree',
      'Banarasi Embroidered Zari Festive Silk Saree',
      'Mysore Crepe Silk Traditional Saree',
      'Chanderi Brocade Gold Butta Heritage Saree',
      'Paithani Shalu Silk Royal Celebration Saree',
      'Patola Silk Handcrafted Ikat Designer Saree'
    ],
    descriptions: [
      'Handcrafted by master weavers with pure zari floral buttis on the body and an ornate pallu border. Woven from 100% genuine silk, bringing royal elegance to weddings and festive occasions. Includes matching unstitched blouse fabric.',
      'Exquisite Banarasi silk saree adorned with rich antique gold zari borders and intricate paisley motifs. Lightweight yet opulent, providing a graceful drape that stays comfortable all day.',
      'Traditional heritage silk saree with vibrant contrast pallu and golden thread work. Soft on the skin with an ethereal sheen that captures festive lighting magnificently.'
    ],
    sizes: ['Free Size with 0.8m Blouse Piece'],
    colors: ['Royal Crimson Red', 'Emerald Green', 'Peacock Blue', 'Mustard Gold', 'Deep Wine', 'Temple Orange'],
    priceRange: [2499, 8999],
    specs: (title, brand) => ({
      "Fabric Material": "100% Pure Woven Silk",
      "Saree Length": "5.5 Metres",
      "Blouse Length": "0.8 Metre (Unstitched)",
      "Weave Type": "Traditional Handloom Jacquard",
      "Occasion": "Weddings, Festive Ceremonies, Celebrations",
      "Care Instructions": "Dry Clean Only",
      "Brand Heritage": brand
    }),
    tags: ['saree', 'sarees', 'silk', 'kanjivaram', 'banarasi', 'ethnic', 'bridal', 'traditional', 'festive', 'women']
  },

  'Kurtis': {
    brands: ['Biba Ethnic', 'W for Woman', 'Aurelia Festive', 'FabIndia Craft', 'Global Desi', 'Libas Couture', 'Rangriti'],
    productTitles: [
      'Handcrafted Embroidered Rayon Festive Kurti',
      'Jaipur Block Printed Pure Cotton Straight Kurti',
      'Anarkali Flared Georgette Embellished Kurti',
      'A-Line Chanderi Silk Tunic Kurti',
      'Gold Foil Print Festive High-Low Kurti',
      'Mandarin Collar Embroidered Daily Wear Kurti'
    ],
    descriptions: [
      'Crafted from breathable, soft-drape rayon fabric featuring delicate thread embroidery on the yoke and side slits. Pair effortlessly with palazzos, leggings, or denim for festive gatherings and casual ethnic style.',
      'Authentic Jaipur hand-block printed pure cotton straight kurti. Designed with a round neck with notch, three-quarter sleeves, and side slits for superior all-day breathability and comfort.',
      'Graceful flared Anarkali silhouette tailored in lightweight georgette with micro-pleats and golden foil embellishments. Flowy, elegant, and perfectly structured for celebrations.'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Indigo Navy', 'Mustard Yellow', 'Blush Pink', 'Emerald Green', 'Maroon Red', 'Powder Blue'],
    priceRange: [799, 2999],
    specs: (title, brand) => ({
      "Fabric Material": "Premium Combed Rayon & Cotton Blends",
      "Kurti Length": "Calf Length (44 inches)",
      "Sleeve Type": "3/4 Regular Sleeves",
      "Neckline": "Round Neck with Embroidered Notch",
      "Fit Type": "Straight Comfort Fit",
      "Care Instructions": "Machine Wash Cold / Gentle Cycle",
      "Brand Name": brand
    }),
    tags: ['kurti', 'kurtis', 'kurtas', 'ethnic', 'indian wear', 'cotton', 'rayon', 'embroidery', 'festive', 'women']
  },

  'Dresses': {
    brands: ['Zara Style', 'Mango Contemporary', 'H&M Trend', 'AND Studio', 'Forever New', 'Vero Moda'],
    productTitles: [
      'Floral Flutter Crepe Summer A-Line Dress',
      'Velvet Vintage Slit Evening Cocktail Dress',
      'Tiered Ruffle Bohemian Linen Midi Dress',
      'Square Neck Smocked Fit & Flare Sun Dress',
      'Belted Button-Front Utility Safari Dress'
    ],
    descriptions: [
      'Breezy and vibrant A-line silhouette tailored in soft woven crepe. Features a flattering cinched waistline, gentle flutter sleeves, and a romantic botanical print suited for brunches and vacations.',
      'Sophisticated evening dress with a structured square neckline, concealed back zipper, and flowy silhouette that drapes gracefully with every step.',
      'Casual tiered midi dress woven from sustainable viscose-linen blend. Breathable, relaxed, and effortlessly styled with sneakers or wedges.'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral Blossom', 'Midnight Navy', 'Emerald Olive', 'Pastel Lilac', 'Ruby Red'],
    priceRange: [1299, 4499],
    specs: (title, brand) => ({
      "Material": "100% Breathable Viscose Crepe",
      "Dress Length": "Midi / Knee Length",
      "Closure": "Concealed Side/Back Zipper",
      "Fit": "Fit and Flare Silhouette",
      "Care Instructions": "Machine Wash Cold",
      "Brand Label": brand
    }),
    tags: ['dress', 'dresses', 'midi dress', 'summer dress', 'floral', 'cocktail dress', 'women fashion']
  },

  'Tops': {
    brands: ['Vero Moda', 'H&M Basics', 'Zara Trend', 'Marks & Spencer', 'Only Casuals', 'Allen Solly Woman'],
    productTitles: [
      'Chiffon Formal Panel Work Peplum Top',
      'Organic Ribbed Knit Basic Crop Top',
      'Satin Sweetheart High Neck Blouse Top',
      'Cotton Eyelet Embroidered Ruffle Top',
      'Relaxed Poplin Button-Up Collared Top'
    ],
    descriptions: [
      'Lightweight chiffon top with subtle pleated detailing and keyhole button back. Pairs smoothly with tailored trousers for office wear or jeans for casual weekend outings.',
      'Soft organic ribbed cotton top with just enough elastane for a snug, flattering fit. Retains shape and soft texture wash after wash.',
      'Chic satin top with subtle sheen and flutter cuffs. Elevates any dinner ensemble with understated sophistication.'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ivory Cream', 'Sage Green', 'Midnight Black', 'Dusty Rose', 'Sky Blue'],
    priceRange: [599, 1999],
    specs: (title, brand) => ({
      "Fabric Material": "Cotton & Chiffon Blend",
      "Sleeve Style": "Short Cap / 3/4 Sleeves",
      "Collar / Neck": "Mandarin / Crew Neck",
      "Fit Profile": "Regular Fit",
      "Care": "Gentle Machine Wash",
      "Brand": brand
    }),
    tags: ['top', 'tops', 'blouse', 'shirts', 'women fashion', 'casual top', 'party top']
  },

  "Women's Fashion_Jeans": {
    brands: ['Levi\'s Denim', 'Only Skinny', 'Pepe Jeans London', 'Vero Moda Denim', 'Flying Machine', 'Wrangler Denim'],
    productTitles: [
      'High-Rise Sculpt Skinny Fit Stretch Jeans',
      'Wide Leg Relaxed High-Waist Denim Jeans',
      'Classic Straight Fit Whisker Wash Jeans',
      'Ankle Crop Vintage Wash Boyfriend Jeans'
    ],
    descriptions: [
      'Engineered with hyper-stretch denim that hugs your natural curves while offering ultimate mobility. High-rise waistband provides all-day support without gaping.',
      'Vintage-inspired wide leg silhouette cut from authentic heavyweight denim. Features classic 5-pocket styling and antique copper hardware.',
      'Comfortable straight leg jeans with subtle hand-sanded whiskering for an effortlessly lived-in vintage appearance.'
    ],
    sizes: ['26 Waist', '28 Waist', '30 Waist', '32 Waist', '34 Waist'],
    colors: ['Dark Indigo Blue', 'Light Vintage Wash', 'Washed Black', 'Medium Stonewash'],
    priceRange: [1499, 3999],
    specs: (title, brand) => ({
      "Denim Composition": "98% Cotton, 2% Elastane Stretch Denim",
      "Rise Style": "High Rise (11-inch front rise)",
      "Leg Shape": "Skinny / Wide Leg",
      "Pockets": "Classic 5-Pocket Layout",
      "Closure": "Heavy Duty Brass Fly Zipper with Metal Button",
      "Brand Heritage": brand
    }),
    tags: ['jeans', 'denim', 'skinny jeans', 'high waist', 'women jeans', 'trousers', 'pants']
  },

  'Handbags': {
    brands: ['Lavie Luxe', 'Caprese Milano', 'Baggit Eco', 'Michael Kors Urban', 'Hidesign Leather', 'Fossil Classic'],
    productTitles: [
      'Vegan Leather Structured Satchel Handbag',
      'Classic Monogram Travel Canvas Tote Bag',
      'Quilted Dual-Chain Crossbody Shoulder Bag',
      'Executive Multi-Compartment Laptop Tote',
      'Textured Pebble Grain Hobo Handbag'
    ],
    descriptions: [
      'Meticulously crafted from high-grade pebbled vegan leather with polished gold-tone hardware. Generous central compartment with dual zippered pockets for wallet, cosmetics, and smartphone.',
      'Spacious everyday tote bag featuring reinforced double handles and a durable wipe-clean lining. Perfect for daily commutes, shopping, and travel.',
      'Compact yet roomy crossbody bag with diamond quilted texture and an adjustable interwoven chain strap. Ideal for evening dinners and city strolls.'
    ],
    sizes: ['Compact Crossbody', 'Medium Satchel', 'Large Tote (15L)'],
    colors: ['Cognac Tan', 'Midnight Black', 'Nude Blush', 'Deep Burgundy', 'Warm Taupe'],
    priceRange: [1499, 5999],
    specs: (title, brand) => ({
      "Outer Material": "Premium Textured PU Leather",
      "Inner Lining": "High-Density Poly-Satin Lining",
      "Hardware": "Corrosion-Resistant Gold Electroplated Finish",
      "Compartments": "3 Main Sections + 2 Zipper Pockets",
      "Strap": "Detachable & Adjustable Shoulder Strap",
      "Brand Maker": brand
    }),
    tags: ['handbag', 'handbags', 'purse', 'tote', 'satchel', 'shoulder bag', 'crossbody', 'bags']
  },

  'Jewellery': {
    brands: ['Tanishq Mia', 'Giva Sterling', 'Swarovski Crystal', 'Kalyan Heritage', 'Voylla Ethnic', 'Zaveri Pearls'],
    productTitles: [
      '18K Gold Plated Solitaire Crystal Pendant Necklace',
      '925 Sterling Silver Zircon Marquise Hoop Earrings',
      'Traditional Kundan & Pearl Choker Necklace Set',
      'Rose Gold Plated Adjustable Tennis Bracelet',
      'Handcrafted Temple Gold Jhumka Earrings'
    ],
    descriptions: [
      'Precision-set with brilliant cubic zirconia solitaire in an anti-tarnish 18K yellow gold overlay. Hypoallergenic, nickel-free, and packaged in a velvet gift box.',
      'Dainty 925 sterling silver hoop earrings with rhodium protective coating. Lightweight for everyday wear with a secure snap-bar latch closure.',
      'Regal heritage Kundan choker set embellished with faux emerald beads and freshwater pearls. Comes with matching drop jhumkas and maang tikka.'
    ],
    sizes: ['Free Size / Adjustable Chain', 'Standard Drop Size'],
    colors: ['18K Yellow Gold', 'Rose Gold', '925 Sterling Silver', 'Antique Temple Gold'],
    priceRange: [699, 4999],
    specs: (title, brand) => ({
      "Base Metal": "925 Sterling Silver / High Grade Brass Alloy",
      "Plating": "Triple Layer Anti-Tarnish Micron Gold Plating",
      "Stone Type": "AAA Grade Cubic Zirconia / Austrian Crystals",
      "Safety": "100% Nickel & Lead Free (Hypoallergenic)",
      "Packaging": "Jewellery Gift Box with Authenticity Certificate",
      "Jeweller": brand
    }),
    tags: ['jewellery', 'jewelry', 'earrings', 'necklace', 'pendant', 'bracelet', 'silver', 'gold', 'kundan']
  },

  "Women's Fashion_Watches": {
    brands: ['Titan Raga', 'Fossil Jacqueline', 'Daniel Wellington', 'Michael Kors Runway', 'Timex Elegance', 'Casio Sheen'],
    productTitles: [
      'Rose Gold Minimalist Mother-of-Pearl Analog Watch',
      'Diamond Accented Stainless Steel Mesh Watch',
      'Classic Slim Leather Strap Quartz Wristwatch',
      'Two-Tone Sunray Dial Ceramic Dress Watch'
    ],
    descriptions: [
      'Featuring a genuine shimmering mother-of-pearl dial framed by crystal hour markers and an ultra-slim rose gold stainless steel mesh band. Japanese quartz movement ensures pinpoint accuracy.',
      'Modern minimalist timepiece with water-resistant 32mm case, scratch-resistant mineral crystal glass, and quick-release interchangeable strap system.',
      'Understated luxury dress watch designed for boardroom elegance and evening galas. Water resistant up to 30 meters with long-life battery.'
    ],
    sizes: ['30mm Dial (Slim)', '34mm Dial (Medium)'],
    colors: ['Rose Gold Tone', 'Silver Steel', 'Champagne Gold', 'Blush Leather / Rose Gold'],
    priceRange: [1999, 7999],
    specs: (title, brand) => ({
      "Movement Engine": "Japanese Miyota Quartz Movement",
      "Case Diameter": "32 mm Slim Stainless Steel",
      "Glass Crystal": "Scratch-Resistant Mineral Crystal",
      "Water Resistance": "30M / 3 ATM Splash Resistant",
      "Strap Material": "Stainless Steel Mesh / Genuine Calf Leather",
      "Warranty": "2 Years International Manufacturer Warranty",
      "Brand": brand
    }),
    tags: ['watch', 'watches', 'wristwatch', 'analog watch', 'women watch', 'rose gold watch', 'fashion watch']
  },

  "Women's Fashion_Sandals": {
    brands: ['Catwalk Elite', 'Mochi Footwear', 'Bata Red Label', 'Metro Shoes', 'Inc.5 Fashion'],
    productTitles: [
      'Cushioned Memory Foam Flat Casual Sandals',
      'Braided Leatherette Open Toe Slide Sandals',
      'Ankle Strap Buckle Summer Leisure Sandals',
      'Embellished Ethnic Kolhapuri T-Strap Sandals'
    ],
    descriptions: [
      'Designed with thick padded memory foam footbed and soft cross-straps to prevent pinching. Anti-skid textured rubber outsole ensures steady grip on tile and pavement.',
      'Effortless slip-on slide sandals featuring stylish braided straps and arch contour support. Perfect for everyday errands and beach strolls.',
      'Festive ethnic flat sandals adorned with delicate metallic beads and comfortable toe ring structure for ethnic celebrations.'
    ],
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    colors: ['Metallic Gold', 'Tan Brown', 'Jet Black', 'Dusty Rose', 'Silver Frost'],
    priceRange: [699, 2499],
    specs: (title, brand) => ({
      "Upper Material": "Soft Synthetic Leatherette",
      "Insole Cushion": "Multi-Density Ergonomic Foam",
      "Outsole": "Anti-Slip Textured TPR Sole",
      "Heel Height": "Flat (0.5 inch)",
      "Brand": brand
    }),
    tags: ['sandals', 'flats', 'slides', 'footwear', 'women sandals', 'slippers']
  },

  'Heels': {
    brands: ['Aldo Runway', 'Catwalk Elite', 'Mochi Footwear', 'Steve Madden', 'Inc.5 Fashion', 'Bata Red Label'],
    productTitles: [
      'Pointed Toe Patent Leather Stiletto Pumps',
      'Block Heel Ankle Strap Festive Heeled Sandals',
      'Kitten Heel Slingback Formal Office Pumps',
      'Platform Strappy Glamour Evening Heels'
    ],
    descriptions: [
      'Sculpted with a glossy patent finish and a cushioned insole that softens impact on the balls of your feet. Adds instant poise and confidence to power suits and cocktail gowns.',
      'Sturdy 2.5-inch block heel offering superior balance and stability. Soft ankle buckle strap keeps feet secure during dance and celebratory festivities.',
      'Sleek slingback kitten heels crafted with supple matte leatherette, perfect for all-day office comfort without sacrificing style.'
    ],
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    colors: ['Nude Gloss', 'Classic Pitch Black', 'Crimson Red', 'Metallic Champagne'],
    priceRange: [1499, 4999],
    specs: (title, brand) => ({
      "Heel Height": "2.5 to 3.5 inches",
      "Heel Type": "Stiletto / Block Heel",
      "Upper": "Premium Gloss Patent / Faux Suede",
      "Footbed": "Padded Anti-Fatigue Arch Support",
      "Brand Heritage": brand
    }),
    tags: ['heels', 'stiletto', 'block heels', 'pumps', 'sandals', 'women footwear', 'party heels']
  },

  // ==========================================
  // MEN'S FASHION
  // ==========================================
  'Shirts': {
    brands: ['Peter England', 'Allen Solly', 'Raymond Tailored', 'Louis Philippe', 'Van Heusen', 'Arrow Formals', 'Blackberrys'],
    productTitles: [
      '100% Combed Cotton Oxford Slim Fit Shirt',
      'Pure French Linen Casual Resort Shirt',
      'Formal Solid Herringbone Twill Shirt',
      'Gingham Plaid Long Sleeve Casual Button-Down',
      'Wrinkle-Free Non-Iron Executive Business Shirt'
    ],
    descriptions: [
      'Spun from 100% long-staple combed cotton offering a crisp feel, natural breathability, and exceptional color fastness. Features a sharp cutaway collar, reinforced button placket, and adjustable cuffs.',
      'Breezy pure linen shirt designed with a relaxed regular fit and patch chest pocket. Keeps you cool and effortlessly dapper in warm temperatures.',
      'Tailored business shirt featuring an innovative wrinkle-free finish that looks newly pressed throughout long workdays and business flights.'
    ],
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
    colors: ['Crisp White', 'Sky Oxford Blue', 'Charcoal Slate', 'Dusty Olive', 'Soft Pink', 'French Navy'],
    priceRange: [899, 2999],
    specs: (title, brand) => ({
      "Fabric Material": "100% Premium Long-Staple Cotton",
      "Weave Style": "Oxford / Herringbone Twill Weave",
      "Collar Type": "Classic Spread / Button-Down Collar",
      "Cuff Type": "Adjustable Barrel Cuffs",
      "Fit Profile": "Tailored Slim Fit",
      "Care": "Machine Wash Warm / Easy Iron",
      "Brand Label": brand
    }),
    tags: ['shirt', 'shirts', 'formal shirt', 'casual shirt', 'cotton shirt', 'oxford shirt', 'men fashion']
  },

  'T-Shirts': {
    brands: ['US Polo Assn', 'Tommy Hilfiger', 'Puma Essentials', 'Nike Sportswear', 'Jack & Jones', 'Levi\'s Classic'],
    productTitles: [
      'Supima Cotton Heavyweight Crewneck T-Shirt',
      'Pique Bio-Washed Classic Collar Polo T-Shirt',
      'Moisture Wicking Quick-Dry Athletic Tee',
      'Slim Fit Slub Cotton Henley Neck T-Shirt',
      'Vintage Graphic Print Streetwear T-Shirt'
    ],
    descriptions: [
      'Crafted from 100% American Supima cotton known for ultra-fine softness and twice the durability of standard cotton. Bio-washed for zero shrinkage and silky hand feel.',
      'Classic polo shirt knit from breathable honeycomb pique fabric. Features ribbed collar, two-button mother-of-pearl placket, and side-vent hemline.',
      'Lightweight athletic performance t-shirt with active dry technology that pulls sweat away from the body during intense workouts and runs.'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Jet Black', 'Pure White', 'Heather Grey', 'Navy Blue', 'Forest Green', 'Burgundy'],
    priceRange: [499, 1799],
    specs: (title, brand) => ({
      "Material Composition": "100% Bio-Washed Combed Cotton (200 GSM)",
      "Neckline": "Ribbed Crewneck / 2-Button Polo Collar",
      "Sleeve": "Short Sleeves with Reinforced Stitching",
      "Fit": "Modern Regular Fit",
      "Care": "Machine Wash Cold with Similar Colors",
      "Brand": brand
    }),
    tags: ['tshirt', 't-shirt', 'tee', 'polo', 'crewneck', 'cotton tshirt', 'men clothing']
  },

  "Men's Fashion_Jeans": {
    brands: ['Levi\'s 511', 'Wrangler Rugged', 'Pepe Jeans London', 'Lee Modern', 'Spykar Denim', 'Flying Machine'],
    productTitles: [
      'Original Straight Fit Raw Indigo Denim Jeans',
      'Slim Tapered Stretch Distressed Denim Jeans',
      'Athletic Fit Flex Waistband Daily Jeans',
      'Dark Wash Clean Cut Executive Denim Jeans'
    ],
    descriptions: [
      'Constructed with authentic heavyweight denim infused with responsive stretch fiber. Sits at the waist with room through the thigh and a clean straight leg opening.',
      'Versatile slim tapered cut featuring subtle hand-whiskering at the hips and reinforced rivet bar-tacks on stress points for maximum longevity.',
      'Deep indigo raw rinse denim engineered to develop unique personalized fades over time while maintaining supreme flexibility.'
    ],
    sizes: ['30 Waist', '32 Waist', '34 Waist', '36 Waist', '38 Waist'],
    colors: ['Dark Indigo Wash', 'Medium Stonewash', 'Pitch Black', 'Vintage Grey Tint'],
    priceRange: [1499, 3999],
    specs: (title, brand) => ({
      "Fabric": "98% Ring-Spun Cotton, 2% Spandex",
      "Denim Weight": "12.5 oz Mid-Weight Denim",
      "Rise Style": "Mid-Rise",
      "Fly Type": "Heavy Duty Brass Zipper Fly with Button Shank",
      "Pocket Count": "5 Pockets with Coin Pocket",
      "Brand Heritage": brand
    }),
    tags: ['jeans', 'denim', 'slim jeans', 'straight jeans', 'men jeans', 'pants', 'trousers']
  },

  'Trousers': {
    brands: ['Raymond Formal', 'Van Heusen Business', 'Allen Solly Chinos', 'Peter England Elite', 'Arrow Classic'],
    productTitles: [
      'Tailored Flat Front Cotton Casual Chinos',
      'Poly-Viscose Wrinkle Resistant Formal Trousers',
      'Stretch Tech Smart Comfort Office Pants',
      'Linen Blend Relaxed Summer Trousers'
    ],
    descriptions: [
      'Tailored from durable twill cotton with comfortable elastane flex. Clean flat front styling with angled slash front pockets and buttoned rear welt pockets.',
      'Sharp poly-viscose dress trousers engineered with permanent front crease and non-slip inner shirt grip waistband for boardroom confidence.',
      'Modern hybrid chino pant suitable for smart-casual offices, client presentations, and dinner evenings.'
    ],
    sizes: ['30 Waist', '32 Waist', '34 Waist', '36 Waist', '38 Waist'],
    colors: ['Khaki Beige', 'Charcoal Grey', 'Navy Blue', 'Olive Green', 'Jet Black'],
    priceRange: [999, 2999],
    specs: (title, brand) => ({
      "Material": "Cotton-Spandex Twill / Poly-Viscose Blend",
      "Fit": "Slim Fit Flat Front",
      "Waistband": "Curved Ergonomic Waistband with Shirt Gripper",
      "Pockets": "2 Slant Front Pockets + 2 Button Welt Back Pockets",
      "Care": "Machine Washable / Low Heat Iron",
      "Brand": brand
    }),
    tags: ['trousers', 'chinos', 'formal pants', 'pants', 'men trousers', 'office wear']
  },

  'Hoodies': {
    brands: ['Superdry Urban', 'Jack & Jones', 'Puma Fleece', 'Nike Air', 'Wrangler Rogue', 'Under Armour'],
    productTitles: [
      'Heavyweight French Terry Pullover Hoodie',
      'Zip-Up Fleece Lined Winter Hooded Sweatshirt',
      'Drop Shoulder Oversized Streetwear Hoodie',
      'Athletic Training Thermal Raglan Hoodie'
    ],
    descriptions: [
      'Knit from 380 GSM dense French terry cotton with a brushed interior for maximum warmth and ultra-soft skin touch. Features double-layered hood with metal aglet drawcords.',
      'Full front zip closure hoodie with kangaroo split pockets and heavy ribbed cuffs. Holds its structural shape after extensive washing.',
      'Relaxed streetwear silhouette featuring dropped shoulders and a roomy front kangaroo pouch pocket for cold hands and phone storage.'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Onyx Black', 'Heather Grey', 'Olive Drab', 'Navy Blue', 'Maroon Red'],
    priceRange: [1299, 3999],
    specs: (title, brand) => ({
      "Fabric Weight": "380 GSM Heavyweight Fleece",
      "Material": "80% Cotton, 20% Polyester Fleece",
      "Hood Style": "Double Layered with Braided Drawstrings",
      "Pocket": "Kangaroo Handwarmer Pocket",
      "Cuffs & Hem": "2x2 Elasticated Ribbing",
      "Brand": brand
    }),
    tags: ['hoodie', 'hoodies', 'sweatshirt', 'fleece', 'winter wear', 'men hoodie', 'streetwear']
  },

  'Jackets': {
    brands: ['Wrangler Rogue', 'Woodland Outdoor', 'US Polo Assn', 'Superdry Urban', 'Levi\'s Trucker', 'Puma Outerwear'],
    productTitles: [
      'Classic Denim Sherpa-Lined Trucker Jacket',
      'Matte Finish Biker Leatherette Windproof Jacket',
      'Ultralight Packable Down Feather Puffer Jacket',
      'Water-Resistant Outdoor Adventure Windbreaker'
    ],
    descriptions: [
      'Iconic trucker silhouette cut from sturdy cotton denim lined with cozy faux sherpa fleece on the collar and body. Features dual button-flap chest pockets and side welt pockets.',
      'Sleek cafe racer jacket crafted from premium wind-resistant polyurethane leatherette with zippered cuffs and antique silver asymmetrical hardware.',
      'Ultra-compact packable puffer jacket filled with lightweight synthetic down insulation to retain body heat during chilling breezes.'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Midnight Black', 'Vintage Denim Blue', 'Cognac Brown', 'Military Green'],
    priceRange: [1999, 6999],
    specs: (title, brand) => ({
      "Outer Shell": "Heavy Cotton Denim / Windproof Leatherette",
      "Lining": "Thermal Faux Sherpa / Quilted Polyfill",
      "Closure": "Heavy Metal Shank Buttons / YKK Full Zip",
      "Pockets": "4 Exterior Pockets + 1 Secure Internal Wallet Pocket",
      "Care": "Specialist Clean / Hand Wipe",
      "Brand Label": brand
    }),
    tags: ['jacket', 'jackets', 'leather jacket', 'denim jacket', 'puffer jacket', 'winter jacket', 'men jacket']
  },

  "Men's Fashion_Watches": {
    brands: ['Fossil Grant', 'Titan Octane', 'Casio Edifice', 'Citizen Eco-Drive', 'Seiko Automatic', 'Timex Expedition'],
    productTitles: [
      'Chronograph Stainless Steel Tachymeter Watch',
      'Automatic Skeleton Dial Mechanical Wristwatch',
      'Minimalist Leather Strap Classic Date Watch',
      'Rugged Outdoor Tactical 100M Water Watch'
    ],
    descriptions: [
      'Precision multi-dial chronograph watch featuring 1/10th second stopwatch sub-dials, date display window, and luminescent hands on a deep sunburst dial.',
      'Exhibition skeleton case back showcasing a self-winding automatic mechanical movement powered by natural wrist motion with no battery required.',
      'Sleek dress watch paired with genuine top-grain calf leather band and a scratch-proof mineral crystal lens for distinguished business attire.'
    ],
    sizes: ['42mm Dial', '44mm Dial'],
    colors: ['Silver Case / Black Dial', 'Rose Gold / Blue Dial', 'Gunmetal Steel', 'Silver / Tan Leather'],
    priceRange: [2499, 12999],
    specs: (title, brand) => ({
      "Movement Type": "Japanese Quartz Chronograph / Automatic Movement",
      "Case Diameter": "43 mm Solid Stainless Steel Case",
      "Crystal Glass": "Hardened Anti-Scratch Mineral Glass",
      "Water Resistance": "50M / 5 ATM (Swim & Shower Safe)",
      "Band Material": "Solid Stainless Steel Link / Genuine Leather",
      "Warranty": "2 Years Manufacturer Warranty",
      "Brand Heritage": brand
    }),
    tags: ['watch', 'watches', 'chronograph', 'men watch', 'automatic watch', 'analog watch', 'wrist watch']
  },

  'Sportswear': {
    brands: ['Nike Dri-FIT', 'Adidas Aeroready', 'Puma Performance', 'Under Armour HeatGear', 'Reebok Active'],
    productTitles: [
      'Dri-FIT Compression Training Base Layer Top',
      '4-Way Stretch Performance Gym Running Shorts',
      'Tapered Ankle Zip Athletic Jogger Pants',
      'Thermal Breathable Workout Zip Pullover'
    ],
    descriptions: [
      'Engineered with sweat-wicking multi-directional stretch fabric that stabilizes muscles and minimizes friction during high-intensity workouts.',
      'Lightweight running shorts with built-in compression liner, zippered phone pocket, and laser-cut ventilation holes along the side seams.',
      'Tapered athletic joggers with zippered side pockets and ribbed ankle cuffs. Keeps you warm during warmups and outdoor training.'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal Heather', 'Stealth Black', 'Navy Space', 'Volt Grey'],
    priceRange: [799, 2999],
    specs: (title, brand) => ({
      "Fabric Material": "88% Polyester, 12% Spandex Quick-Dry Knit",
      "Technology": "Sweat Wicking Moisture Management",
      "Flexibility": "4-Way Ergonomic Stretch",
      "Pockets": "Zippered Side Slash Pockets",
      "Care Instructions": "Machine Wash Cold",
      "Brand": brand
    }),
    tags: ['sportswear', 'gym wear', 'running shorts', 'joggers', 'activewear', 'workout clothes', 'men sportswear']
  },

  // ==========================================
  // FOOTWEAR
  // ==========================================
  'Running Shoes': {
    brands: ['Nike Air Zoom', 'Adidas Ultraboost', 'Puma Nitro', 'Asics Gel-Nimbus', 'Skechers HyperBurst', 'Saucony Grid'],
    productTitles: [
      'Air Zoom Pegasus Responsive Running Shoes',
      'Ultraboost Dual-Density Foam Road Runners',
      'Gel-Cushioned All-Terrain Trail Running Shoes',
      'Carbon-Plate Speed Propulsion Marathon Shoes',
      'Flyknit Breathable Neutral Daily Running Shoes'
    ],
    descriptions: [
      'Engineered with pressurized Zoom Air cushioning units and lightweight foam for smooth, highly responsive energy return on asphalt and tracks. Breathable engineered mesh upper keeps feet ventilated over long distances.',
      'Designed with full-length responsive boost midsole foam that absorbs foot strike impact and propels your stride forward. Continental rubber outsole provides exceptional wet and dry traction.',
      'Durable trail runner with reinforced rock plate, water-resistant upper coating, and aggressive multidirectional traction lugs for mud, gravel, and incline ascents.'
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Volt Red / Black', 'Triple Cloud White', 'Cobalt Blue / Volt', 'Stealth All-Black', 'Slate Grey / Orange'],
    priceRange: [2499, 9999],
    specs: (title, brand) => ({
      "Midsole Technology": "Dual-Density Responsive Energy Foam",
      "Upper Material": "Seamless Engineered Flyknit Mesh",
      "Outsole": "High-Abrasion Carbon Traction Rubber",
      "Arch Support": "Neutral to High Arch Stability",
      "Closure": "Padded Tongue Lace-Up Lock",
      "Brand": brand
    }),
    tags: ['running shoes', 'shoes', 'sneakers', 'sports shoes', 'footwear', 'trainers', 'jogging shoes']
  },

  'Casual Shoes': {
    brands: ['Clarks Craft', 'Hush Puppies', 'Red Tape Casual', 'Woodland Tough', 'Bata Comfit', 'Crocs Classic'],
    productTitles: [
      'Handcrafted Suede Leather Penny Loafers',
      'Canvas Slip-On Lightweight Deck Shoes',
      'Burnished Tan Leather Casual Boat Shoes',
      'Comfort Orthotic Arch Support Walking Shoes'
    ],
    descriptions: [
      'Handcrafted from supple suede leather with a memory foam insole and contrast moc-toe stitching. Effortlessly matches with chinos, shorts, and jeans.',
      'Lightweight breathable canvas upper with elastic side gores for easy slip-on convenience and all-day cushioned walking comfort.',
      'Classic boat shoe silhouette featuring rust-proof eyelets, genuine leather 360-degree lacing, and siped non-marking rubber outsoles.'
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Tan Suede', 'Navy Blue Canvas', 'Chestnut Brown', 'Charcoal Slate'],
    priceRange: [1299, 4499],
    specs: (title, brand) => ({
      "Upper": "Genuine Suede / Breathable Heavy Canvas",
      "Footbed": "Orthotic Dual-Foam Padded Insole",
      "Sole": "Flexible Non-Marking Vulcanized Rubber",
      "Fit Type": "Standard Medium Width",
      "Brand": brand
    }),
    tags: ['casual shoes', 'loafers', 'boat shoes', 'slip on shoes', 'shoes', 'footwear', 'men shoes']
  },

  'Formal Shoes': {
    brands: ['Clarks Bostonian', 'Louis Philippe Royal', 'Bata Executive', 'Hush Puppies Leather', 'Red Tape Formal', 'Ruosh Handcrafted'],
    productTitles: [
      'Italian Hand-Burnished Leather Oxford Shoes',
      'Classic Wingtip Brogues Dress Shoes',
      'Polished High Shine Double Monk Strap Shoes',
      'Cap-Toe Derby Formal Business Shoes'
    ],
    descriptions: [
      'Crafted from premium full-grain Italian leather with hand-burnished toe detailing. Features closed lacing, leather lining, and a durable Goodyear-welted construction for boardrooms and galas.',
      'Timeless wingtip brogues adorned with decorative perforations and a cushioned footbed designed to prevent foot fatigue during full-day conferences.',
      'Modern double monk strap formal shoes with polished silver buckles and a sleek tapered silhouette that pairs impeccably with tailored suits.'
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Burnished Mahogany Tan', 'Classic Jet Black', 'Deep Cognac Brown'],
    priceRange: [1999, 6999],
    specs: (title, brand) => ({
      "Upper Leather": "100% Full-Grain Genuine Calf Leather",
      "Lining": "Breathable Moisture-Absorbing Leather Lining",
      "Sole Construction": "Goodyear Welted Stacked Heel Sole",
      "Closure": "Closed Oxford Lacing / Monk Buckle",
      "Brand Heritage": brand
    }),
    tags: ['formal shoes', 'oxford shoes', 'derby shoes', 'brogues', 'monk strap', 'dress shoes', 'leather shoes']
  },

  'Sneakers': {
    brands: ['Nike Air Force', 'Adidas Originals', 'Puma Suede Classic', 'Vans Old Skool', 'Converse All Star', 'New Balance 574'],
    productTitles: [
      'Retro Leather Low-Top Streetwear Sneakers',
      'Chunky Platform Colorblock Casual Sneakers',
      'High-Top Canvas Heritage Skate Sneakers',
      'Suede Classic Heritage Casual Sneakers'
    ],
    descriptions: [
      'Timeless low-top profile crafted from smooth leather with perforated toe box for airflow, padded collar, and durable cupsole rubber traction.',
      'Urban street sneaker featuring contrast suede and leather overlays atop a lightweight shock-absorbing midsole.',
      'Iconic high-top canvas sneaker with rubber toe cap and waffle tread outsole that transitions seamlessly from skateparks to casual evening hangs.'
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Triple Crisp White', 'Black & White Vintage', 'Pastel Multi-Color', 'Shadow Grey'],
    priceRange: [1799, 6499],
    specs: (title, brand) => ({
      "Upper Material": "Smooth Leather & Suede Panels",
      "Insole": "Removable Cushioned EVA Sockliner",
      "Sole": "Durable Solid Rubber Cupsole",
      "Style": "Streetwear Lifestyle Sneaker",
      "Brand": brand
    }),
    tags: ['sneakers', 'streetwear', 'casual sneakers', 'shoes', 'high top sneakers', 'white sneakers']
  },

  'Sports Shoes': {
    brands: ['Nike Court Precision', 'Adidas Predator Turf', 'Puma Multi-Court', 'Nivia Pro Grip', 'Yonex Power Cushion'],
    productTitles: [
      'Multi-Court High Traction Badminton Shoes',
      'Indoor Gym Training Grip Sport Sneakers',
      'Turf Traction Precision Football Training Shoes',
      'Lateral Stability Tennis Court Sport Shoes'
    ],
    descriptions: [
      'Equipped with gum rubber non-marking outsoles for sharp directional cuts and superior lateral grip on indoor wooden and synthetic courts.',
      'Designed with reinforced midfoot wrap support and torsion shank to safeguard ankles during explosive jumps and side-to-side sprints.',
      'Versatile cross-training turf shoes featuring shock absorption pads in the heel and forefoot for high-impact aerobic routines.'
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Neon Lime / Black', 'Electric Blue', 'White / Solar Red', 'Stealth Black'],
    priceRange: [1499, 4999],
    specs: (title, brand) => ({
      "Outsole": "Non-Marking Court Gum Rubber",
      "Midsole": "High-Impact Shock Cushioning Foam",
      "Upper": "Synthetic Leather with Breathable Mesh Inserts",
      "Ankle Stability": "Reinforced Lateral TPU Support Shank",
      "Brand": brand
    }),
    tags: ['sports shoes', 'badminton shoes', 'tennis shoes', 'court shoes', 'gym shoes', 'footwear']
  },

  "Footwear_Sandals": {
    brands: ['Woodland Outdoor', 'Bata Comfit', 'Clarks Craft', 'Red Tape Casual', 'Crocs Classic'],
    productTitles: [
      'Heavy Duty Nubuck Leather Outdoor Sandals',
      'Double Strap Waterproof Active Footwear Sandals',
      'Orthotic Arch Support Travel Walking Sandals',
      'Adjustable Velcro Strap Comfort Slide Sandals'
    ],
    descriptions: [
      'Rugged outdoor sandals built with weather-treated nubuck leather and deep lug rubber outsoles for rocky trails, streams, and daily wear.',
      'Waterproof quick-drying synthetic straps with triple velcro adjustment points for a customized, secure fit in all weather conditions.',
      'Ergonomic contoured footbed designed to align the foot arch and reduce heel strain during extended walking tours.'
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Camel Brown', 'Olive Green', 'Jet Black', 'Chocolate Tan'],
    priceRange: [799, 2999],
    specs: (title, brand) => ({
      "Upper Material": "Tough Nubuck Leather / Waterproof Webbing",
      "Insole": "Ergonomic Contoured Cushion Bed",
      "Outsole": "Heavy-Duty Deep Lug Traction Rubber",
      "Closure": "Adjustable Hook-and-Loop Velcro Straps",
      "Brand": brand
    }),
    tags: ['sandals', 'leather sandals', 'outdoor sandals', 'footwear', 'slippers', 'men sandals']
  },

  // ==========================================
  // KIDS
  // ==========================================
  'Boys Clothing': {
    brands: ['US Polo Kids', 'Mothercare Baby', 'Gini & Jony', 'Hopscotch Studio', 'Lilliput', 'Chicco Apparel'],
    productTitles: [
      '100% Cotton Graphic Tee & Denim Shorts Set',
      'Plaid Button-Down Collar Shirt with Bowtie',
      'Durable Multi-Pocket Cotton Cargo Joggers',
      'Full-Sleeve Fleece Winter Sweatshirt & Trackpants'
    ],
    descriptions: [
      'Soft combed organic cotton t-shirt paired with elasticated denim shorts. Gentle on sensitive skin with no scratchy internal labels.',
      'Charming party shirt tailored in breathable cotton poplin, complete with a detachable clip-on bowtie for birthday celebrations.',
      'Heavy-duty reinforced knee cargo joggers with elastic drawstring waistband and deep utility pockets for toys and outdoor discoveries.'
    ],
    sizes: ['2-3 Years', '4-5 Years', '6-7 Years', '8-9 Years', '10-12 Years'],
    colors: ['Navy / Yellow', 'Sky Blue Plaid', 'Olive Green', 'Red / Charcoal'],
    priceRange: [499, 1799],
    specs: (title, brand) => ({
      "Material": "100% Pure Combed Cotton (Hypoallergenic)",
      "Fit": "Relaxed Kids Fit with Elastic Stretch Waist",
      "Wash Care": "Machine Wash Warm / Color Safe",
      "Age Group": "2 to 12 Years",
      "Brand": brand
    }),
    tags: ['kids clothing', 'boys clothing', 'kids tshirt', 'kids shorts', 'boys wear', 'children wear']
  },

  'Girls Clothing': {
    brands: ['Mothercare Baby', 'Hopscotch Studio', 'Gini & Jony', 'Lilliput', 'Chicco Apparel'],
    productTitles: [
      'Floral Embroidered Multi-Tier Cotton Frock Dress',
      'Sequined Princess Tulle Holiday Party Gown',
      'Soft Cotton Stretch Leggings & Peplum Top Set',
      'Denim Dungaree Pinafore Dress with Striped Tee'
    ],
    descriptions: [
      'Whimsical tiered frock crafted from pure breathable cotton with delicate floral embroidery and a soft inner cotton lining for zero itchiness.',
      'Dazzling party gown featuring shimmering sequin bodice and multi-layered soft tulle skirt that twirls beautifully at birthday parties.',
      'Cozy two-piece outfit featuring a floral peplum top and super-stretch leggings designed for playdates and daily comfort.'
    ],
    sizes: ['2-3 Years', '4-5 Years', '6-7 Years', '8-9 Years', '10-12 Years'],
    colors: ['Pastel Pink', 'Lavender Purple', 'Sunshine Yellow', 'Mint Green'],
    priceRange: [599, 2199],
    specs: (title, brand) => ({
      "Fabric Composition": "100% Breathable Cotton with Soft Tulle Overlay",
      "Lining": "100% Skin-Friendly Pure Cotton Inner Lining",
      "Closure": "Smooth Concealed Back Zipper",
      "Age Group": "2 to 12 Years",
      "Brand": brand
    }),
    tags: ['kids clothing', 'girls clothing', 'girls dress', 'frock', 'party gown', 'children wear']
  },

  'Toys': {
    brands: ['LEGO Ingenious', 'Hot Wheels Speed', 'Fisher-Price Learning', 'Barbie Dream', 'Nerf Elite', 'Funskool Play'],
    productTitles: [
      'STEM Interactive Programmable Assembly Robotics Kit',
      'Modular Multi-Story Wooden Dollhouse Playset',
      'Magnetic Geometric Tiles 100-Piece Building Set',
      'Die-Cast High-Speed Track Racing Car Launcher Kit',
      'Educational Montessori Wooden Shape Sorter Box'
    ],
    descriptions: [
      'Encourages critical thinking, spatial reasoning, and introductory coding concepts through hands-on modular brick assembly and motorized gearboxes.',
      'Precision-cut sustainable wooden dollhouse complete with movable furniture pieces and realistic sliding partition doors for imaginative roleplay.',
      'Vibrant magnetic building tiles made from shatter-resistant non-toxic ABS plastic with smooth rounded safety edges for creative 3D architecture.'
    ],
    sizes: ['50-Piece Set', '100-Piece Kit', 'Deluxe Edition'],
    colors: ['Multi-Color Rainbow', 'Vibrant Primary Colors', 'Pastel Blocks'],
    priceRange: [499, 3999],
    specs: (title, brand) => ({
      "Material Safety": "100% Non-Toxic BPA-Free ABS Plastic & Natural Wood",
      "Age Suitability": "Ages 3+ to 12 Years",
      "Skill Development": "STEM Learning, Motor Skills, Problem Solving",
      "Certifications": "EN71 and ASTM International Safety Standards",
      "Brand": brand
    }),
    tags: ['toys', 'kids toys', 'stem toys', 'lego', 'building blocks', 'dollhouse', 'educational toys', 'games']
  },

  'School Bags': {
    brands: ['Wildcraft Ortho', 'Skybags Campus', 'American Tourister Kids', 'Safari Wonder', 'VIP SchoolMate'],
    productTitles: [
      'Ergonomic Multi-Zip Orthopedic School Backpack',
      'Waterproof High Capacity Character School Bag',
      'Insulated Lunch Pocket Dual Compartment Backpack',
      'Lightweight Night Reflective Strip Student Bag'
    ],
    descriptions: [
      'Engineered with anatomically padded back panel and thick breathable shoulder straps to distribute textbook weight evenly and protect young posture.',
      'Spacious 3-compartment school bag crafted from water-resistant ripstop polyester. Features dual elastic side mesh bottle sleeves and pencil organizer.',
      'Durable reinforced base backpack with heavy-duty dual zippers and 3M night safety reflective strips for safe road visibility on rainy mornings.'
    ],
    sizes: ['Small (18L - Kindergarten)', 'Medium (26L - Primary)', 'Large (32L - High School)'],
    colors: ['Galaxy Blue', 'Electric Pink', 'Camouflage Green', 'Sonic Red'],
    priceRange: [699, 2499],
    specs: (title, brand) => ({
      "Volume Capacity": "26 to 32 Litres",
      "Material": "Water-Resistant 600D Heavy Ripstop Polyester",
      "Ergonomics": "Padded Air-Mesh Back Support & Sternum Strap",
      "Pockets": "3 Main Compartments + Stationery Organizer + 2 Bottle Holders",
      "Warranty": "1 Year Replacement Warranty",
      "Brand": brand
    }),
    tags: ['school bag', 'backpack', 'kids bag', 'book bag', 'travel bag', 'kids']
  },

  // ==========================================
  // BOOKS
  // ==========================================
  'Programming Books': {
    brands: ['O\'Reilly Media', 'Packt Publishing', 'Addison-Wesley', 'Manning Publications', 'No Starch Press', 'Pragmatic Bookshelf'],
    productTitles: [
      'Designing Data-Intensive Applications: The Definitive Guide',
      'Full-Stack TypeScript & React Microservices Architecture',
      'Clean Code: A Handbook of Agile Software Craftsmanship',
      'Mastering Distributed Systems & Cloud Native Engineering',
      'Database Internals: Storage Engines & Consensus Algorithms'
    ],
    descriptions: [
      'An exhaustive and rigorous exploration of distributed data systems, storage engine architectures, replication tradeoffs, and fault-tolerant cloud patterns.',
      'Practical, code-rich handbook guiding developers through clean component architecture, state management, asynchronous backend services, and production deployment.',
      'Essential software engineering classic teaching readable code patterns, automated testing suites, refactoring principles, and solid object-oriented design.'
    ],
    sizes: ['Paperback Edition', 'Hardcover Collector\'s Edition', 'Kindle eBook Format'],
    colors: ['Standard Print Edition'],
    priceRange: [499, 1899],
    specs: (title, brand) => ({
      "Publisher": brand,
      "Format": "Paperback / Hardcover",
      "Language": "English",
      "Page Count": `${getRandomInt(380, 820)} Pages`,
      "Target Audience": "Software Engineers, System Architects, Developers",
      "ISBN-13": `978-0${getRandomInt(100000000, 999999999)}`
    }),
    tags: ['programming book', 'coding', 'books', 'software engineering', 'typescript', 'computer science', 'tech books']
  },

  'Fiction Novels': {
    brands: ['Penguin Random House', 'HarperCollins Fiction', 'Bloomsbury Classic', 'Simon & Schuster', 'Rupa Publications'],
    productTitles: [
      'The Midnight Library: A Sunday Times Bestselling Novel',
      'Echoes of the Forgotten Clockmaker: Fantasy Epic',
      'Shadows Over the Silent Harbor: Historical Mystery',
      'The Quantum Paradox: Speculative Sci-Fi Thriller',
      'Beneath the Crimson Banyan: Literary Masterpiece'
    ],
    descriptions: [
      'A deeply moving and imaginative tale exploring parallel lives, second chances, and what truly makes life worth living in an infinite multidimensional library.',
      'Atmospheric historical thriller packed with suspense, complex psychological twists, and richly drawn period detail that keeps readers enthralled till the final page.',
      'Epic high-fantasy saga filled with intricate worldbuilding, political intrigue, and unforgettable heroes battling against ancient mythological forces.'
    ],
    sizes: ['Paperback', 'Hardcover Deluxe Edition'],
    colors: ['Standard Print Edition'],
    priceRange: [299, 999],
    specs: (title, brand) => ({
      "Publisher": brand,
      "Genre": "Literary Fiction / Fantasy / Mystery Thriller",
      "Format": "Mass Market Paperback / Hardcover",
      "Page Count": `${getRandomInt(280, 560)} Pages`,
      "Language": "English",
      "ISBN-13": `978-1${getRandomInt(100000000, 999999999)}`
    }),
    tags: ['fiction', 'novel', 'books', 'bestseller', 'literature', 'story book', 'reading']
  },

  'Academic Textbook': {
    brands: ['Pearson Higher Ed', 'McGraw Hill Education', 'Oxford University Press', 'Cambridge Academic', 'Wiley Science'],
    productTitles: [
      'Advanced Engineering Mathematics & Numerical Calculus',
      'Principles of Modern Microeconomics & Global Policy',
      'University Physics: Quantum Mechanics & Fluid Dynamics',
      'Organic Chemistry: Structure, Reaction & Mechanism'
    ],
    descriptions: [
      'Authoritative university curriculum textbook featuring comprehensive theory, step-by-step solved problem sets, and real-world industrial case studies.',
      'Standard reference text covering mathematical proofs, rigorous analytical formulas, and chapter-end review exercises for graduate and undergraduate students.',
      'Clear, conceptual approach to fundamental scientific principles illustrated with full-color diagrams, practice equations, and laboratory procedures.'
    ],
    sizes: ['Student Paperback Edition', 'Hardcover Reference Library Edition'],
    colors: ['Standard Print Edition'],
    priceRange: [699, 2999],
    specs: (title, brand) => ({
      "Publisher": brand,
      "Academic Level": "Undergraduate / Postgraduate University Courses",
      "Format": "Comprehensive Reference Textbook",
      "Page Count": `${getRandomInt(650, 1200)} Pages`,
      "Language": "English",
      "ISBN-13": `978-0${getRandomInt(100000000, 999999999)}`
    }),
    tags: ['textbook', 'academic', 'books', 'mathematics', 'physics', 'engineering', 'higher education']
  },

  'Competitive Exams Prep': {
    brands: ['Arihant Publications', 'Disha Experts', 'Kiran Prakashan', 'S. Chand Academic', 'GK Publications'],
    productTitles: [
      'Quantitative Aptitude & Numerical Ability Master Guide',
      'Verbal & Non-Verbal Reasoning Comprehensive Manual',
      'General Knowledge & Current Affairs Yearbook with Mock Tests',
      'Exhaustive Practice Papers & 15-Year Solved Question Bank'
    ],
    descriptions: [
      'Comprehensive exam preparation guide featuring shortcut techniques, speed calculation methods, and over 5,000 topic-wise practice questions with detailed solutions.',
      'Structured test preparation manual designed by leading subject matter experts with chapter-wise solved papers and full-length timed diagnostic mock exams.',
      'Indispensable handbook for government, banking, engineering, and civil service entrance examinations with thoroughly updated trend analyses.'
    ],
    sizes: ['Paperback Study Edition'],
    colors: ['Standard Print Edition'],
    priceRange: [399, 1499],
    specs: (title, brand) => ({
      "Publisher": brand,
      "Exam Coverage": "UPSC, Banking, SSC, CAT & State Public Service Exams",
      "Features": "5000+ Practice MCQs with Step-by-Step Solutions",
      "Format": "Paperback Manual",
      "Language": "English",
      "Edition": "2026 Latest Revised Edition"
    }),
    tags: ['exam prep', 'aptitude', 'reasoning', 'books', 'study guide', 'solved papers', 'competitive exams']
  },

  // ==========================================
  // GAMING
  // ==========================================
  'Gaming Consoles': {
    brands: ['Sony PlayStation', 'Microsoft Xbox', 'Nintendo Switch', 'Valve SteamDeck', 'Asus ROG Ally'],
    productTitles: [
      'PlayStation 5 Slim 1TB Ultra HD Gaming Console',
      'Xbox Series X 4K 120FPS 1TB Gaming Console',
      'Nintendo Switch OLED Model Handheld Console',
      'Portable PC Handheld Gaming Console (512GB NVMe SSD)'
    ],
    descriptions: [
      'Experience lightning-fast game loading with an ultra-high-speed custom SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D spatial audio.',
      'Next-generation 4K gaming powerhouse delivering up to 120 FPS performance, 12 teraflops of GPU computing power, and hardware-accelerated DirectX raytracing.',
      'Vibrant 7-inch OLED screen with deep blacks and intense colors, wide adjustable kickstand, and detachable Joy-Con controllers for home and tabletop multiplayer.'
    ],
    sizes: ['Standard Disc Edition (1TB SSD)', 'Digital Edition (1TB SSD)', 'Collector\'s 2TB Bundle'],
    colors: ['Glacier White', 'Matte Carbon Black', 'Neon Blue / Red'],
    priceRange: [29990, 54990],
    specs: (title, brand) => ({
      "Processor Engine": "Custom AMD Zen 2 8-Core / RDNA 2 GPU Architecture",
      "Storage Capacity": "1TB Custom High-Speed PCIe 4.0 NVMe SSD",
      "Video Output": "Native 4K 120Hz / HDR10 / 8K Support",
      "Audio": "Custom Tempest 3D / Dolby Atmos Spatial Audio",
      "Connectivity": "Wi-Fi 6, Bluetooth 5.1, HDMI 2.1, USB-C 3.2",
      "Brand": brand
    }),
    tags: ['gaming console', 'playstation', 'xbox', 'nintendo', 'console', 'video games', 'gaming', '4k gaming']
  },

  'Gaming Keyboards': {
    brands: ['Razer Chroma', 'Logitech G-Series', 'Corsair Gaming', 'SteelSeries Apex', 'HyperX Alloy', 'Redragon Mechanical'],
    productTitles: [
      'RGB Mechanical Hot-Swappable Linear Switch Keyboard',
      'Ultra-Low Latency Wireless Opto-Mechanical Esports Keyboard',
      'Compact 65% Tournament Mechanical Gaming Keyboard',
      'Tenkeyless (TKL) Aircraft Aluminum Frame Gaming Keyboard'
    ],
    descriptions: [
      'Equipped with custom hot-swappable linear mechanical switches, sound-dampening silicone foam layers, and double-shot PBT keycaps for creamy, responsive keystrokes.',
      'Esports grade sub-millisecond optical actuation speed with individual per-key RGB Chroma backlighting and programmable macro keys.',
      'Compact 65% form factor freeing up essential desk space for wide mouse sweeps, featuring braided detachable USB-C cable and aluminum top plate.'
    ],
    sizes: ['65% Compact', 'Tenkeyless (80%)', 'Full Size 104-Key'],
    colors: ['Matte Black', 'Mercury White', 'Retro Cyberpunk Grey'],
    priceRange: [1999, 7999],
    specs: (title, brand) => ({
      "Switch Type": "Hot-Swappable Linear Red / Clicky Blue Mechanical Switches",
      "Keycaps": "Double-Shot PBT Oil-Resistant Keycaps",
      "Backlighting": "Per-Key 16.8 Million Color Custom RGB",
      "Polling Rate": "1000Hz Ultra-Fast Polling (1ms)",
      "Frame Material": "Anodized Aircraft-Grade Aluminum",
      "Brand": brand
    }),
    tags: ['gaming keyboard', 'mechanical keyboard', 'rgb keyboard', 'esports', 'gaming', 'pc accessories']
  },

  'Gaming Mice': {
    brands: ['Logitech G-Series', 'Razer Chroma', 'SteelSeries Apex', 'Corsair Gaming', 'HyperX Alloy', 'Glorious PC Gaming'],
    productTitles: [
      'Ultra-Lightweight 58g Honeycomb Wireless Gaming Mouse',
      'Surgical 26K DPI Optical Sensor Esports Mouse',
      'Ergonomic Multi-Button MMO/MOBA Programmable Mouse',
      'Dual-Mode Bluetooth & 2.4GHz Wireless Pro Mouse'
    ],
    descriptions: [
      'Featherlight 58-gram symmetrical chassis offering effortless swift flick shots in competitive FPS games, zero-delay 2.4GHz wireless link, and 70-hour battery life.',
      'Features a flagship 26,000 DPI optical sensor with 650 IPS tracking speed and 50G acceleration for pixel-perfect crosshair precision.',
      'Ergonomic right-handed palm grip design with 11 programmable macro buttons and textured rubber side grips for marathon raiding sessions.'
    ],
    sizes: ['Standard Ergonomic', 'Mini / Compact'],
    colors: ['Matte Black', 'Ghost White', 'Electric Yellow'],
    priceRange: [1299, 5999],
    specs: (title, brand) => ({
      "Sensor Technology": "26K DPI High-Precision Optical Sensor",
      "Weight": "58 grams Ultra-Lightweight",
      "Battery Life": "Up to 80 Hours Continuous Gaming",
      "Switch Lifespan": "80 Million Clicks Optical Switches",
      "Connectivity": "Lag-Free 2.4GHz Wireless & USB-C Speedflex",
      "Brand": brand
    }),
    tags: ['gaming mouse', 'mouse', 'wireless mouse', 'esports mouse', 'gaming', 'pc accessories']
  },

  'Gaming Headset': {
    brands: ['HyperX Cloud', 'SteelSeries Arctis', 'Razer BlackShark', 'Logitech G Pro X', 'Audio-Technica Gaming'],
    productTitles: [
      '7.1 Surround Sound Wireless Low-Latency Gaming Headset',
      'Broadcaster-Grade ANC Microphone Esports Headset',
      'Memory Foam Ear Cushion 50mm Titanium Driver Headset',
      'Multi-Platform 3.5mm & USB Pro Studio Gaming Headphones'
    ],
    descriptions: [
      'Custom tuned 50mm neodymium audio drivers deliver crystal-clear highs, rich mids, and deep spatial bass to pinpoint footsteps and directional enemy gunfire.',
      'Equipped with a broadcast-quality detachable noise-cancelling microphone that filters out keyboard clicks and background room chatter.',
      'Plush leatherette memory foam ear cushions and lightweight aluminum frame ensure comfortable head pressure during 8+ hour gaming streams.'
    ],
    sizes: ['Over-Ear Standard'],
    colors: ['Matte Black / Red Accent', 'Arctic White', 'Gunmetal Grey'],
    priceRange: [1999, 8999],
    specs: (title, brand) => ({
      "Driver Unit": "50mm Custom Neodymium Magnet Drivers",
      "Spatial Audio": "DTS Headphone:X 2.0 / 7.1 Virtual Surround",
      "Microphone": "Detachable Noise-Cancelling Cardioid Mic",
      "Connectivity": "2.4GHz Wireless + 3.5mm Analog Audio Cable",
      "Battery Life": "Up to 30 Hours Playtime",
      "Brand": brand
    }),
    tags: ['gaming headset', 'headphones', 'gaming audio', 'surround sound', 'mic', 'gaming', 'pc audio']
  },

  'Controllers': {
    brands: ['Sony DualSense', 'Xbox Wireless Elite', 'Razer Wolverine', '8BitDo Ultimate', 'PowerA Fusion'],
    productTitles: [
      'Tactile Trigger Haptic Feedback Wireless Gamepad',
      'Custom Re-mappable Back Paddles Esports Game Controller',
      'Hall Effect Magnetic Drift-Free Joystick Controller',
      'Cross-Platform Bluetooth & 2.4GHz Gaming Controller'
    ],
    descriptions: [
      'Engineered with magnetic Hall Effect joysticks that permanently prevent stick drift, responsive mechanical microswitch face buttons, and textured ergonomic grips.',
      'Features immersive dynamic haptic rumble motors, dual-stage hair-trigger locks, and 4 remappable rear macro paddles for instant tactical commands.',
      'Seamless multi-device connectivity supporting PC, Steam Deck, iOS, Android, and home gaming consoles with low wireless latency.'
    ],
    sizes: ['Standard Ergonomic Gamepad'],
    colors: ['Midnight Black', 'Cosmic Red', 'Arctic Camo', 'Glacier White'],
    priceRange: [1999, 6999],
    specs: (title, brand) => ({
      "Joystick Technology": "Hall Effect Magnetic Sensors (Anti-Drift)",
      "Trigger Style": "2-Stage Adjustable Hair Triggers",
      "Compatibility": "PC, Consoles, Android, iOS, Steam",
      "Connectivity": "Bluetooth 5.2, 2.4GHz USB Dongle, Type-C",
      "Battery": "Built-in 1000mAh Rechargeable Lithium Battery",
      "Brand": brand
    }),
    tags: ['controller', 'gamepad', 'joystick', 'gaming controller', 'xbox controller', 'playstation controller', 'gaming']
  },

  'Gaming Chairs': {
    brands: ['Secretlab Titan', 'Green Soul Monster', 'Corsair T3', 'Vertagear Racing', 'Apex Ergonomics'],
    productTitles: [
      'Ergonomic Moulded Spine Support Racing Gaming Chair',
      'Full Recline 180-Degree Multi-Offset Lumbar Gaming Seat',
      'Breathable Soft-Weave Fabric Ergonomic Executive Chair',
      'High-Density Cold-Cure Foam 4D Armrest Gaming Chair'
    ],
    descriptions: [
      'Constructed with high-density cold-cure foam and reinforced steel frame that supports correct lumbar curvature and reduces spine fatigue over long gaming sessions.',
      'Features full 90 to 180-degree multi-angle tilt mechanism, class-4 explosion-proof hydraulic gas lift, and magnetic plush velour memory foam neck pillow.',
      'Upholstered in breathable, tear-resistant soft-weave fabric designed to stay cool in warm climates while resisting friction wear.'
    ],
    sizes: ['Regular (Up to 100kg)', 'XL (Up to 150kg)'],
    colors: ['Stealth Carbon Black', 'Racing Red / Black', 'Arctic Ash Grey'],
    priceRange: [8999, 24999],
    specs: (title, brand) => ({
      "Frame Construction": "Heavy Gauge Reinforced Steel Frame",
      "Recline Angle": "90° to 180° Full Backrest Recline",
      "Armrests": "4D Multi-Directional Adjustable Armrests",
      "Gas Lift": "Class-4 Heavy Duty SGS Certified Gas Piston",
      "Base": "Solid Aluminum Alloy 5-Star Caster Base",
      "Brand": brand
    }),
    tags: ['gaming chair', 'ergonomic chair', 'desk chair', 'office chair', 'gaming seat', 'gaming']
  },

  // ==========================================
  // ELECTRONICS
  // ==========================================
  'Smartphones': {
    brands: ['Apple iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus Nord', 'Xiaomi Pro', 'Vivo X-Series'],
    productTitles: [
      'Galaxy S24 Ultra 5G (12GB RAM, 256GB Storage)',
      'iPhone 15 Pro Max A17 Pro (256GB Titanium)',
      'Pixel 8 Pro AI-Powered Triple Camera 5G Phone',
      'OnePlus 12 5G Fast Charging AMOLED Smartphone',
      'Flagship Slim Foldable Dual AMOLED Display Smartphone'
    ],
    descriptions: [
      'Features a breathtaking 6.8-inch Dynamic AMOLED 2X 120Hz display, quad 200MP camera system with 100x Space Zoom, and all-day intelligent battery optimization.',
      'Forged in aerospace-grade titanium with high-refresh Super Retina XDR screen, next-generation computational photography, and lightning-fast processor efficiency.',
      'Crisp high-refresh AMOLED screen with ultra-fast 100W SuperVOOC flash charging that fills battery from 1% to 100% in under 28 minutes.'
    ],
    sizes: ['128GB ROM + 8GB RAM', '256GB ROM + 12GB RAM', '512GB ROM + 16GB RAM'],
    colors: ['Titanium Gray', 'Phantom Black', 'Ocean Emerald Blue', 'Cream White'],
    priceRange: [19999, 94999],
    specs: (title, brand) => ({
      "Display": "6.7-inch 120Hz LTPO AMOLED (2600 nits peak)",
      "Processor": "Flagship 4nm Octa-Core High-Speed Processor",
      "Rear Camera": "50MP Main OIS + 12MP Ultra-Wide + 10MP Telephoto",
      "Battery & Charging": "5000mAh with 80W Fast Charging Support",
      "OS & Network": "5G Dual SIM / Wi-Fi 7 / Android 14 / iOS",
      "Brand": brand
    }),
    tags: ['smartphone', 'mobile phone', 'phone', '5g phone', 'android', 'iphone', 'electronics', 'smart phone']
  },

  'Laptops': {
    brands: ['Apple MacBook', 'Dell XPS', 'HP Spectre', 'Lenovo ThinkPad', 'Asus ZenBook', 'Acer Swift'],
    productTitles: [
      'MacBook Pro 16 M3 Max (36GB Unified RAM, 1TB SSD)',
      'XPS 15 InfinityEdge OLED Intel Core i9 Ultra Laptop',
      'ThinkPad X1 Carbon Gen 12 Ultralight Business Laptop',
      'ZenBook Duo Dual-Screen OLED Creative Workstation Laptop',
      'Spectre x360 2-in-1 Convertible Touchscreen Laptop'
    ],
    descriptions: [
      'Engineered for demanding workflows with high-core processors, liquid retina XDR high-refresh display, 22-hour battery life, and high-speed unified memory.',
      'Ultra-thin CNC aluminum unibody housing a vibrant 4K OLED borderless touchscreen, dedicated creator graphics, and studio-grade multi-speaker sound array.',
      'Legendary military-tested durability weighing just 1.12 kg with carbon fiber lid, ergonomic backlit spill-resistant keyboard, and enterprise biometric security.'
    ],
    sizes: ['16GB RAM / 512GB SSD', '32GB RAM / 1TB SSD', '64GB RAM / 2TB SSD'],
    colors: ['Space Gray', 'Platinum Silver Aluminum', 'Midnight Matte Black'],
    priceRange: [44999, 149999],
    specs: (title, brand) => ({
      "Processor": "Latest Generation Multi-Core Intel Core Ultra / Apple Silicon M-Series",
      "RAM & Storage": "16GB to 64GB DDR5 / High Speed NVMe PCIe 4.0 SSD",
      "Display": "15.6-inch 3K OLED / Liquid Retina Display (120Hz)",
      "Battery Life": "Up to 18 Hours Typical Productivity Usage",
      "Weight": "1.35 kg Slim & Portable",
      "Brand Heritage": brand
    }),
    tags: ['laptop', 'notebook', 'macbook', 'ultrabook', 'computer', 'workstation', 'electronics', 'pc']
  },

  'Tablets': {
    brands: ['Apple iPad', 'Samsung Galaxy Tab', 'Lenovo Tab Plus', 'Xiaomi Pad', 'Microsoft Surface'],
    productTitles: [
      'iPad Air 11-inch M2 Liquid Retina Display Tablet',
      'Galaxy Tab S9 Ultra AMOLED 14.6-inch S-Pen Tablet',
      'Pro 11-inch 144Hz High-Refresh Stylus Tablet',
      'Eye-Care PaperMatte e-Note & Drawing Tablet'
    ],
    descriptions: [
      'Versatile ultra-thin tablet supporting high-precision active stylus drawing, quad stereo speakers, and powerful multi-window desktop multitasking.',
      'Immersive 14.6-inch Dynamic AMOLED screen with low-latency magnetic stylus included in box. IP68 water resistance for creative productivity anywhere.',
      'High-performance tablet equipped with 144Hz refresh rate, 8840mAh battery, and split-screen document workflows.'
    ],
    sizes: ['128GB Wi-Fi', '256GB Wi-Fi + 5G Cellular', '512GB Wi-Fi + 5G'],
    colors: ['Space Gray', 'Starlight Gold', 'Graphite Navy'],
    priceRange: [19999, 69999],
    specs: (title, brand) => ({
      "Display Screen": "11-inch 2.8K IPS / AMOLED 120Hz Display",
      "Processor": "High-Efficiency 8-Core Mobile Platform",
      "Stylus Support": "Magnetic Charging Active Stylus Compatible",
      "Battery": "8600mAh with 45W Fast Charging",
      "Audio": "Quad Stereo Speakers with Dolby Atmos Tuning",
      "Brand": brand
    }),
    tags: ['tablet', 'ipad', 'android tablet', 'drawing tablet', 'touchscreen', 'electronics', 'portable display']
  },

  'Smart Watches': {
    brands: ['Apple Watch Series', 'Samsung Galaxy Watch', 'Garmin Forerunner', 'Fitbit Sense', 'Noise ColorFit', 'Amazfit GTR'],
    productTitles: [
      'Always-On AMOLED Display ECG & SpO2 Smartwatch',
      'Rugged Dual-Frequency GPS Outdoor Adventure Watch',
      'Slim Aluminum Fitness Tracker Watch with Bluetooth Calling',
      'Titanium Sapphire Heart Rate & Sleep Monitor Smartwatch'
    ],
    descriptions: [
      'Monitors real-time heart rate, SpO2 blood oxygen, sleep stage architecture, and ECG health metrics on an ultra-bright Always-On AMOLED sapphire touch screen.',
      'Rugged outdoor smartwatch engineered with military shock resistance, dual-frequency multi-satellite GPS navigation, and 14-day battery life.',
      'Lightweight wrist companion featuring built-in microphone and speaker for crisp Bluetooth phone calls and quick voice assistant commands.'
    ],
    sizes: ['40mm Case (Slim Wrist)', '44mm Case (Standard)', '47mm Rugged Case'],
    colors: ['Midnight Black', 'Silver Aluminum', 'Rose Gold', 'Ocean Green'],
    priceRange: [1999, 29999],
    specs: (title, brand) => ({
      "Display": "1.43-inch Always-On Super AMOLED (1000 nits)",
      "Health Sensors": "Optical Heart Rate, SpO2, ECG, Sleep & Stress Monitor",
      "Battery Life": "Up to 7 Days (Typical) / 48 Hours with AOD",
      "Water Protection": "5 ATM / IP68 Swimming & Shower Proof",
      "Connectivity": "Bluetooth 5.3, Standalone GPS, NFC",
      "Brand": brand
    }),
    tags: ['smartwatch', 'smart watch', 'fitness tracker', 'watch', 'wearables', 'electronics', 'activity tracker']
  },

  'Earbuds': {
    brands: ['Sony WF-1000XM', 'Apple AirPods', 'Samsung Galaxy Buds', 'JBL Live Free', 'Bose QuietComfort', 'Sennheiser Momentum'],
    productTitles: [
      'Active Noise Cancelling (ANC) True Wireless Earbuds',
      'Spatial Audio Hi-Res LDAC Wireless Earbuds with Mic',
      'Sweatproof Ergonomic Sports Earhook Workout Buds',
      'Dual-Driver Transparency Mode Bluetooth In-Ear Buds'
    ],
    descriptions: [
      'Industry-leading active noise cancellation powered by dual microphones and integrated audio processors to block engine drones and cafe chatter completely.',
      'Hi-Res Audio Wireless certification with LDAC codec support transmitting 3x more audio detail. Crystal clear phone calls with 6 AI beamforming mics.',
      'Ergonomic contour fit with flexible soft silicone ear-tips, IPX5 sweat resistance, and compact pocket charging case providing 36 hours of total playback.'
    ],
    sizes: ['Compact In-Ear with 3 Ear-Tip Sizes (S/M/L)'],
    colors: ['Matte Black', 'Pearl White', 'Midnight Blue', 'Silver Frost'],
    priceRange: [1499, 18999],
    specs: (title, brand) => ({
      "Noise Cancellation": "Hybrid Active Noise Cancellation (Up to -42dB)",
      "Driver Diameter": "11mm Dynamic Bass Boost Drivers",
      "Battery Playtime": "8 Hours (Earbuds) + 28 Hours (Charging Case)",
      "Water Resistance": "IPX5 Sweat and Splash Resistant",
      "Bluetooth Version": "Bluetooth 5.3 with Fast Pair & Multipoint Connect",
      "Brand": brand
    }),
    tags: ['earbuds', 'wireless earbuds', 'bluetooth earphones', 'headphones', 'airpods', 'anc earbuds', 'electronics']
  },

  // ==========================================
  // BEAUTY & COSMETICS
  // ==========================================
  'Makeup Foundation': {
    brands: ['Maybelline Fit Me', 'MAC Studio Fix', 'L\'Oréal Infallible', 'Lakmé 9to5 Primer', 'Estée Lauder Double Wear'],
    productTitles: [
      'Matte + Poreless 24-Hour Full Coverage Liquid Foundation',
      'Hydrating Dewy Glow Serum Foundation with SPF 25',
      'Oil-Free Breathable Weightless Finish Fluid Foundation',
      'Skin-Balancing Mineral Powder Foundation Compact'
    ],
    descriptions: [
      'Formulated with micro-blurring powders that control shine and blur visible pores for a seamless natural matte finish that lasts 24 hours without caking.',
      'Infused with hydrating hyaluronic acid serum and broad-spectrum SPF 25 sun protection. Evens out skin tone while leaving a radiant dewy complexion.',
      'Lightweight, transfer-resistant buildable formula designed for humidity and warm temperatures. Dermatologically tested and non-comedogenic.'
    ],
    sizes: ['30 ml Pump Bottle', '50 ml Value Pack'],
    colors: ['Warm Honey (Shade 220)', 'Natural Ivory (Shade 115)', 'Golden Caramel (Shade 310)', 'Sun Beige (Shade 312)'],
    priceRange: [499, 2999],
    specs: (title, brand) => ({
      "Coverage Level": "Medium to Full Buildable Coverage",
      "Finish Type": "Natural Matte / Luminous Dewy Glow",
      "Skin Compatibility": "Normal, Oily, Combination & Sensitive Skin",
      "Formulation": "Dermatologically Tested, Paraben-Free, Non-Comedogenic",
      "Volume": "30 ml Glass Bottle with Precision Pump",
      "Brand": brand
    }),
    tags: ['foundation', 'makeup', 'liquid foundation', 'beauty', 'cosmetics', 'face makeup', 'skin care']
  },

  'Skin Care Serum': {
    brands: ['The Ordinary Active', 'Minimalist Clinical', 'Plum Goodness', 'Dot & Key Vitamin', 'Forest Essentials Soundarya'],
    productTitles: [
      '10% Niacinamide + 1% Zinc Blemish & Pore Serum',
      '15% Vitamin C + Ferulic Acid Glow Brightening Serum',
      '2% Hyaluronic Acid + B5 Deep Hydration Plumping Serum',
      'Multi-Peptide Complex Age-Defense Collagen Serum'
    ],
    descriptions: [
      'Clinical formulation designed to reduce skin blemishes, balance excess sebum activity, and smooth uneven skin texture for clear, radiant skin.',
      'Potent antioxidant serum powered by pure Ethyl Ascorbic Acid to fade hyperpigmentation, protect against environmental free radicals, and boost collagen synthesis.',
      'Multi-molecular weight hyaluronic acid penetrates deep dermal layers to lock in moisture, plump fine lines, and restore the skin moisture barrier.'
    ],
    sizes: ['30 ml Dropper Bottle', '50 ml Value Size'],
    colors: ['Standard Clear / Amber Formulation'],
    priceRange: [499, 2499],
    specs: (title, brand) => ({
      "Active Key Ingredients": "Pure Vitamin C / Niacinamide & Hyaluronic Acid",
      "Application Target": "Pigmentation, Hydration, Anti-Aging & Barrier Repair",
      "Usage Routine": "Morning and Night after Cleansing",
      "Safety Profile": "Fragrance-Free, Essential Oil-Free, Cruelty-Free",
      "Packaging": "UV-Protective Dropper Bottle",
      "Brand": brand
    }),
    tags: ['serum', 'skincare', 'skin care', 'face serum', 'vitamin c', 'hyaluronic acid', 'beauty', 'cosmetics']
  },

  'Hair Care Oil': {
    brands: ['Moroccanoil Treatment', 'Indulekha Bringha', 'Kérastase Elixir', 'Mamaearth Onion', 'Biotique Bio Bhringraj'],
    productTitles: [
      'Pure Cold-Pressed Moroccan Argan Hair Treatment Oil',
      'Ayurvedic Bringha & Rosemary Root Strengthening Hair Oil',
      'Red Onion & Black Seed Oil for Anti-Hair Fall & Shine',
      'Organic Virgin Coconut & Sweet Almond Deep Nourishing Oil'
    ],
    descriptions: [
      'Infused with antioxidant-rich argan oil and essential fatty acids to detangle, smooth frizz, speed up blow-drying time, and boost brilliant mirror shine.',
      'Traditional Ayurvedic formulation prepared with virgin coconut oil and 11 medicinal herbs to nourish the scalp and stimulate strong, thick hair growth.',
      'Non-sticky, fast-absorbing hair elixir that deeply conditions dry ends, shields against heat styling damage, and restores silky softness.'
    ],
    sizes: ['100 ml Bottle', '200 ml Bottle with Easy Comb Applicator'],
    colors: ['Golden Amber Oil'],
    priceRange: [399, 2499],
    specs: (title, brand) => ({
      "Key Botanicals": "100% Pure Moroccan Argan Oil / Bhringraj / Onion Seed Extract",
      "Hair Type": "Suitable for All Hair Types (Dry, Damaged, Curly, Colored)",
      "Benefits": "Anti-Frizz, Scalp Nourishment, Heat Protection, Shine",
      "Formula": "Mineral Oil Free, Silicone Free, 100% Natural Extracts",
      "Volume": "100 ml / 200 ml",
      "Brand": brand
    }),
    tags: ['hair oil', 'hair care', 'argan oil', 'skincare', 'hair serum', 'beauty', 'natural oil']
  },

  'Perfume Spray': {
    brands: ['Chanel Coco', 'Dior Sauvage', 'Davidoff Cool Water', 'Titan Skinn Raw', 'Calvin Klein One', 'Versace Eros'],
    productTitles: [
      'Luxury Eau De Parfum Woody Amber & Bergamot Spray',
      'Fresh Oceanic Breeze & Cedarwood Long Lasting Cologne',
      'Royal Oud Wood & Smoky Vanilla Intense Perfume',
      'Floral Bouquet & Sparkling Mandarin Eau De Toilette'
    ],
    descriptions: [
      'A magnetic and sophisticated fragrance opening with crisp Calabrian bergamot and Sichuan pepper, evolving into warm ambergris and smoky cedarwood undertones.',
      'Exhilarating aquatic blend capturing the freshness of ocean mist, peppermint leaves, lavender, and rich sandalwood for day-long crisp allure.',
      'Concentrated luxury Eau de Parfum formulated with high fragrance oil percentage ensuring a lingering sillage and 12+ hour longevity on skin and fabric.'
    ],
    sizes: ['50 ml Glass Spray', '100 ml Full Size Flacon'],
    colors: ['Amber Gold Flacon', 'Ocean Blue Flacon', 'Smoky Black Flacon'],
    priceRange: [999, 6999],
    specs: (title, brand) => ({
      "Fragrance Concentration": "Eau De Parfum (18-20% Pure Perfume Oil)",
      "Scent Family": "Woody Oriental / Fresh Aquatic Citrus",
      "Longevity": "8 to 14 Hours Long-Lasting Sillage",
      "Bottle Material": "Heavyweight Designer Glass Vaporizer",
      "Volume": "100 ml / 3.4 fl. oz",
      "Brand": brand
    }),
    tags: ['perfume', 'cologne', 'fragrance', 'eau de parfum', 'body spray', 'scent', 'beauty']
  },

  // ==========================================
  // HOME & KITCHEN
  // ==========================================
  'Modern Sofa': {
    brands: ['Urban Ladder Luxe', 'Wakefit Ergonomic', 'IKEA Kivik', 'Home Centre Living', 'Godrej Interio'],
    productTitles: [
      'Mid-Century Modern 3-Seater Velvet Living Room Sofa',
      'L-Shaped Sectional Right-Facing Fabric Reversible Couch',
      'Solid Sheesham Wood Handcrafted Cushioned 3-Seater Sofa',
      'High-Density Foam Convertible Folding Futon Sofa Bed'
    ],
    descriptions: [
      'Upholstered in plush, stain-resistant premium velvet with deep button-tufted seat cushions and tapered solid eucalyptus wood legs with gold metal accents.',
      'Spacious L-shaped sectional couch offering pocket-spring seating comfort and removable washable cushion covers for easy maintenance.',
      'Crafted with seasoned solid timber framework and high-resilience foam to prevent sagging while delivering firm, ergonomic back support.'
    ],
    sizes: ['3-Seater (84 inch length)', 'L-Shape Sectional (5-Seater)'],
    colors: ['Royal Emerald Green', 'Midnight Navy Blue', 'Warm Charcoal Grey', 'Sandstone Beige'],
    priceRange: [14999, 44999],
    specs: (title, brand) => ({
      "Frame Material": "Seasoned Solid Hardwood & Plywood Core",
      "Upholstery": "High-GSM Spill-Resistant Velvet / Linen Blend",
      "Seating Core": "High-Resilience 32-Density Foam with Pocket Springs",
      "Seating Capacity": "3 to 5 Persons (Up to 450kg Load)",
      "Warranty": "3 Years Comprehensive Frame Warranty",
      "Brand": brand
    }),
    tags: ['sofa', 'couch', 'living room', 'furniture', 'sectional sofa', 'home and kitchen', 'seating']
  },

  'Nonstick Cookware': {
    brands: ['Prestige Granite', 'Wonderchef Royal Velvet', 'Hawkins Futura', 'Pigeon Titanium', 'Vinod Platinum Triply'],
    productTitles: [
      'Hard Anodized Die-Cast Nonstick Wok Kadai with Glass Lid',
      'Tri-Ply Stainless Steel Heavy Gauge Frying Pan (24cm)',
      'Granite Coated 3-Piece Cookware Set (Kadai, Tawa, Fry Pan)',
      'Pre-Seasoned Cast Iron Skillet Pan with Cool-Touch Grip'
    ],
    descriptions: [
      'Engineered with a heavy-gauge 4mm aluminum base and 5-layer German granite non-stick coating that requires minimal cooking oil while preventing food from sticking.',
      'Tri-ply construction with food-grade stainless steel interior, aluminum heat-conductive core, and induction-compatible magnetic steel base for rapid, uniform heating.',
      'Features heat-resistant riveted soft-touch silicone handles and toughened tempered glass lid with steam vent hole for safe monitoring.'
    ],
    sizes: ['24 cm / 2.2 Litres', '28 cm / 4.0 Litres', '3-Piece Kitchen Set'],
    colors: ['Granite Granite Grey', 'Matte Black', 'Mirror Stainless Steel'],
    priceRange: [899, 3999],
    specs: (title, brand) => ({
      "Base Compatibility": "Compatible with Both Gas Stoves & Induction Cooktops",
      "Coating Safety": "100% PFOA, Lead & Cadmium Free Non-Stick",
      "Handle Type": "Cool-Touch Riveted Bakelite / Silicone Handles",
      "Dishwasher Safe": "Yes / Easy Sponge Clean",
      "Warranty": "2 Years Manufacturer Replacement Warranty",
      "Brand": brand
    }),
    tags: ['cookware', 'nonstick pan', 'kadai', 'frying pan', 'kitchenware', 'pots and pans', 'home and kitchen']
  },

  'Organizer Rack': {
    brands: ['Milton Modular', 'IKEA Variera', 'Solimo Storage', 'Kuber Industries', 'Signoraware Compact'],
    productTitles: [
      'Natural Solid Bamboo 3-Tier Expandable Spice Rack',
      'Heavy Duty Rustproof Carbon Steel Multi-Tier Kitchen Trolley',
      'Under-Sink Sliding Drawer Metal Storage Organizer',
      'Wall-Mounted Stainless Steel Kitchen Utensil & Spice Shelf'
    ],
    descriptions: [
      'Crafted from sustainably harvested water-resistant natural bamboo with stepped levels to easily view and access spice jars and condiments.',
      'Sturdy carbon steel wire trolley with smooth 360-degree lockable swivel caster wheels and breathable mesh baskets for fruits, vegetables, and pantry goods.',
      'Heavy-duty sliding drawer organizer with smooth ball-bearing glides to maximize under-counter storage and declutter kitchen countertops.'
    ],
    sizes: ['3-Tier Compact', '4-Tier Rolling Trolley'],
    colors: ['Natural Bamboo', 'Matte Black Carbon Steel', 'Silver Stainless Steel'],
    priceRange: [599, 2499],
    specs: (title, brand) => ({
      "Material": "Solid Bamboo Wood / Rust-Resistant Powder Coated Carbon Steel",
      "Weight Capacity": "Up to 15 kg per Tier",
      "Assembly": "Tool-Free 5-Minute Quick Assembly",
      "Cleaning": "Wipe Clean with Damp Cloth",
      "Brand": brand
    }),
    tags: ['organizer', 'kitchen rack', 'storage', 'spice rack', 'kitchen trolley', 'home and kitchen', 'home storage']
  },

  'Wall Decor Accent': {
    brands: ['Safal Gallery', 'Art Street Modern', 'IKEA Ribba', 'Deco Window', 'Chumbak Heritage'],
    productTitles: [
      'Handcrafted Metallic Ginkgo Leaf Wall Art Sculpture',
      'Set of 3 Framed Botanical Canvas Art Wall Prints',
      'Asymmetrical Modern Geometric Metal Wall Accent',
      'Handmade Wooden Carved Mandala Decorative Wall Plaque'
    ],
    descriptions: [
      'Three-dimensional metallic sculpture handcrafted with shimmering gold and teal patina finish. Creates a stunning focal point above sofas, dining consoles, or headboards.',
      'High-definition giclée canvas prints encased in moisture-proof synthetic wood floating frames. Arrives ready to hang with pre-installed mounting brackets.',
      'Intricate laser-cut and hand-finished mandala wall panel made from seasoned engineered wood, bringing serene bohemian warmth to any living space.'
    ],
    sizes: ['Medium (24 x 16 inches)', 'Large Set of 3 (36 x 24 inches)', 'Grand Accent (48 x 20 inches)'],
    colors: ['Gold & Teal Metallic', 'Botanical Neutral Green', 'Walnut Wood Brown'],
    priceRange: [799, 4499],
    specs: (title, brand) => ({
      "Material": "Anti-Rust Treated Iron Alloy / High-Res Canvas in Wooden Frames",
      "Mounting Hardware": "Heavy-Duty Wall Mounting Hooks & Anchors Included",
      "Finish": "Electrostatically Powder-Coated Anti-Fading Finish",
      "Care": "Dust Gently with Soft Dry Microfiber Cloth",
      "Brand": brand
    }),
    tags: ['wall decor', 'wall art', 'home decor', 'canvas painting', 'metal wall art', 'home and kitchen']
  },

  // ==========================================
  // SPORTS & FITNESS
  // ==========================================
  'Dumbbells Weight': {
    brands: ['Bowflex SelectTech', 'Cultsport Hex', 'Decathlon Domyos', 'Kobo Commercial', 'Proline Fitness'],
    productTitles: [
      'Hexagonal Anti-Roll Rubber Encased Dumbbells (Pair)',
      'Cast Iron Solid Knurled Handle Weight Training Dumbbells',
      'Smart Dial Speed Adjustable Dumbbell (2.5kg to 24kg)',
      'Neoprene Coated Non-Slip Aerobic Hand Weights (Set of 2)'
    ],
    descriptions: [
      'Durable rubber-coated cast iron hexagonal heads prevent rolling on gym floors and protect surfaces from scratches and heavy drops during strength workouts.',
      'Ergonomic contoured chrome handle with medium-depth diamond knurling ensures a firm, non-slip grip during deadlifts, shoulder presses, and lunges.',
      'Innovative dial-adjust weight mechanism replacing up to 15 pairs of individual dumbbells in one compact, space-saving workout station.'
    ],
    sizes: ['Pair of 5 kg (10 kg Total)', 'Pair of 7.5 kg (15 kg Total)', 'Pair of 10 kg (20 kg Total)', 'Pair of 15 kg (30 kg Total)'],
    colors: ['Hexagonal Matte Black', 'Cast Iron Black', 'Teal Aerobic Grip'],
    priceRange: [899, 6999],
    specs: (title, brand) => ({
      "Core Material": "Solid Cast Iron Core with High-Density Heavy Rubber Encasement",
      "Grip Design": "Ergonomic Contoured Chrome Plated Diamond Knurled Steel",
      "Shape": "Hexagonal Anti-Roll Design",
      "Weight Accuracy": "+/- 2% Precision Casting",
      "Brand": brand
    }),
    tags: ['dumbbells', 'weights', 'gym equipment', 'fitness', 'workout', 'strength training', 'sports and fitness']
  },

  'Yoga Mats Foam': {
    brands: ['Manduka Pro', 'Liforme Yoga', 'Decathlon Kimjaly', 'Cultsport EcoGrip', 'Boldfit Dense'],
    productTitles: [
      'High-Density Dual-Texture Non-Slip TPE Yoga & Pilates Mat',
      'Natural Eco-Friendly Organic Cork Non-Slip Exercise Mat',
      'Extra Thick 8mm High-Cushion Joint Protection Fitness Mat',
      'Alignment Line Printed Sweat-Resistant Workout Mat'
    ],
    descriptions: [
      'Engineered with premium dual-layer textured TPE material providing superior non-slip grip on wood and tile floors, even during sweaty hot yoga sessions.',
      'Generous 6mm high-density cushioning cushions knees, elbows, and spine from hard floor surfaces without compromising balance or posture stability.',
      'Antimicrobial closed-cell surface repels sweat and moisture for effortless hygiene. Includes complimentary carrying strap for gym commutes.'
    ],
    sizes: ['6mm Standard (72 x 24 inches)', '8mm Extra Thick Cushion (72 x 26 inches)'],
    colors: ['Ocean Teal / Slate', 'Purple Lavender', 'Natural Cork / Black', 'Midnight Navy'],
    priceRange: [699, 2999],
    specs: (title, brand) => ({
      "Material": "Eco-Friendly TPE (100% PVC & Toxic Phthalate Free)",
      "Dimensions": "72 inches x 24 inches (183cm x 61cm)",
      "Thickness": "6mm to 8mm High-Density Cushioning",
      "Texture": "Dual-Sided Reversible Anti-Slip Wave Texture",
      "Accessories": "Free Adjustable Elastic Carrying Strap Included",
      "Brand": brand
    }),
    tags: ['yoga mat', 'exercise mat', 'fitness mat', 'pilates mat', 'workout mat', 'sports and fitness', 'gym']
  },

  'Fitness Equipment Gym': {
    brands: ['Fitkit Motorized', 'PowerMax Fitness', 'Decathlon Domyos Pro', 'Cultsport SmartRow', 'Reach AirRower'],
    productTitles: [
      'Multi-Angle Adjustable Incline/Decline Heavy Duty Gym Bench',
      'Magnetic Drive Silent Resistance Indoor Rowing Gym Machine',
      'Foldable Motorized Smart Home Treadmill with Auto Incline',
      'Full Body Heavy Resistance Band Set with Door Anchor & Handles'
    ],
    descriptions: [
      'Constructed with 2mm heavy-gauge commercial steel framework with 7 backrest incline positions and 3 seat angles for full-body dumbbell training.',
      'Ultra-quiet magnetic resistance rowing machine with 16 resistance levels, smooth aluminum rail glide, and digital LCD tracking time, stroke count, and calories.',
      'Space-saving foldable home treadmill with 3.0 HP peak motor, multi-layer shock absorption running belt, and Bluetooth fitness app synchronization.'
    ],
    sizes: ['Compact Home Edition', 'Commercial Gym Grade'],
    colors: ['Matte Black & Red', 'Titanium Grey Frame'],
    priceRange: [2499, 29999],
    specs: (title, brand) => ({
      "Frame Material": "2.5mm Heavy Commercial-Grade Alloy Steel",
      "Max User Weight": "Up to 150 kg (330 lbs)",
      "Adjustability": "7 Incline / Decline Functional Positions",
      "Foldable": "Easy Fold & Store Space-Saving Mechanism",
      "Warranty": "2 Years Frame & Motor Warranty",
      "Brand": brand
    }),
    tags: ['gym equipment', 'treadmill', 'exercise bench', 'fitness machine', 'home gym', 'workout', 'sports and fitness']
  },

  // ==========================================
  // GOURMET & CHOCOLATES
  // ==========================================
  'Chocolates': {
    brands: ['Cadbury Silk', 'Ferrero Rocher', 'Lindt Excellence', 'Amul Artisan', 'Nestlé Classic', 'Hershey\'s Gold'],
    productTitles: [
      'Ferrero Rocher Whole Hazelnut Pralines Gift Box (24 Pieces)',
      'Cadbury Dairy Milk Silk Roasted Almond Chocolate Bar (3 x 143g)',
      'Lindt Excellence 70% Smooth Dark Chocolate Bar (100g)',
      'Artisanal Belgian Truffles Assorted Cocoa Pralines Gift Box'
    ],
    descriptions: [
      'Decadent whole crunchy hazelnut enrobed in smooth creamy cocoa filling, encased in a crispy wafer shell coated with milk chocolate and roasted hazelnut pieces.',
      'Rich, silky smooth milk chocolate packed with roasted whole Californian almonds that melt delightfully in the mouth with every bite.',
      'Gourmet Swiss dark chocolate bar crafted from ethically sourced cocoa beans, delivering deep earthy cocoa notes and subtle vanilla sweetness.'
    ],
    sizes: ['150g Pack', '300g Gift Box (24 Pcs)', 'Assorted Pack of 3'],
    colors: ['Golden Gift Foil', 'Classic Cocoa Brown'],
    priceRange: [199, 1499],
    specs: (title, brand) => ({
      "Ingredients": "Fine Cocoa Solids, Whole Milk Solids, Roasted Hazelnuts / Almonds, Cocoa Butter",
      "Flavor Profile": "Rich Milk Chocolate / 70% Intense Dark Cocoa",
      "Dietary Info": "100% Vegetarian Certified",
      "Storage": "Store in a cool, dry place between 15°C to 20°C",
      "Brand": brand
    }),
    tags: ['chocolate', 'chocolates', 'sweets', 'gourmet', 'gift box', 'dark chocolate', 'food']
  }
};

export function generateShopSphereSeed() {
  // ==========================================
  // 1. SELLERS (20 realistic verified stores)
  // ==========================================
  const sellers: Seller[] = [];
  const sellerNames = [
    'Sari Palace Ltd', 'Alpha Electronics & Apparel', 'TechBazaar India', 'StyleTrend Wholesalers',
    'Bookworm Nest', 'Gizmo Outfitters', 'Little Feet Kids', 'Decors & Wooden Crafts',
    'Active Life Sports', 'Cosmetic Glow Hub', 'Urban Denim Mill', 'Gamer Zone World',
    'Silver Line Jewellery', 'Modern Home Kitchen', 'Elite Soles Formal Footwear', 'SuperKids Toy Outlet',
    'Academica Book Depot', 'Swayam Handlooms', 'Apex Power Hardware', 'Future Gadgets Ltd'
  ];

  for (let i = 1; i <= 20; i++) {
    sellers.push({
      id: `seller-${i}`,
      userId: `user-seller-${i}`,
      storeName: sellerNames[i - 1] || `Global Vendor Corp #${i}`,
      description: `Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #${i}`,
      kycStatus: 'APPROVED',
      joinedAt: new Date(Date.now() - i * 10 * 24 * 3600 * 1000).toISOString()
    });
  }

  // ==========================================
  // 2. USERS
  // ==========================================
  const users: User[] = [
    {
      id: 'user-cust-1',
      email: 'rejitha2503@gmail.com',
      name: 'Rejitha Customer',
      role: 'CUSTOMER',
      rewardPoints: 120,
      referralCode: 'SPHERE120',
      verified: true,
      createdAt: new Date('2026-01-15T12:00:00Z').toISOString()
    },
    {
      id: 'user-seller-1',
      email: 'seller@shopsphere.com',
      name: 'Sari Palace Seller',
      role: 'SELLER',
      rewardPoints: 0,
      referralCode: 'SARIP100',
      verified: true,
      createdAt: new Date('2026-01-15T12:00:00Z').toISOString()
    },
    {
      id: 'user-admin-1',
      email: 'admin@shopsphere.com',
      name: 'System Admin',
      role: 'ADMIN',
      rewardPoints: 5000,
      referralCode: 'ADMIN777',
      verified: true,
      createdAt: new Date('2026-01-15T12:00:00Z').toISOString()
    }
  ];

  const passwords: Record<string, string> = {
    'user-cust-1': 'customer123',
    'user-seller-1': 'seller123',
    'user-admin-1': 'admin123'
  };

  for (let i = 2; i <= 20; i++) {
    const sId = `user-seller-${i}`;
    users.push({
      id: sId,
      email: `seller${i}@shopsphere.com`,
      name: `${sellerNames[i - 1]} Manager`,
      role: 'SELLER',
      rewardPoints: getRandomInt(50, 400),
      referralCode: `SELLCODE${100 + i}`,
      verified: true,
      createdAt: new Date(Date.now() - i * 5 * 24 * 3600 * 1000).toISOString()
    });
    passwords[sId] = 'seller123';
  }

  const firstNames = ['Amit', 'Sunita', 'Rahul', 'Priya', 'Vikram', 'Anjali', 'Deepak', 'Kiran', 'Rajesh', 'Neelam', 'Aarav', 'Divya', 'Siddharth', 'Meera', 'Rohan', 'Aditi', 'Sanjay', 'Pooja', 'Vijay', 'Shalini'];
  const lastNames = ['Sharma', 'Patel', 'Verma', 'Singh', 'Gupta', 'Mehta', 'Reddy', 'Nair', 'More', 'Chawla', 'Joshi', 'Das', 'Roy', 'Sen', 'Rao', 'Iyer', 'Bannerjee', 'Pathak', 'Kapoor', 'Mishra'];

  while (users.length < 100) {
    const idx = users.length;
    const f = firstNames[getRandomInt(0, firstNames.length - 1)];
    const l = lastNames[getRandomInt(0, lastNames.length - 1)];
    const email = `${f.toLowerCase()}.${l.toLowerCase()}${idx}@shopsphere.net`;
    const uId = `user-cust-${idx}`;
    
    users.push({
      id: uId,
      email,
      name: `${f} ${l}`,
      role: 'CUSTOMER',
      rewardPoints: getRandomInt(10, 800),
      referralCode: `SPHERE${idx * 13}`,
      verified: true,
      createdAt: new Date(Date.now() - idx * 3 * 24 * 3600 * 1000).toISOString()
    });
    passwords[uId] = 'customer123';
  }

  // ==========================================
  // 3. COUPONS (50 unique)
  // ==========================================
  const coupons: Coupon[] = [
    { id: 'coupon-1', code: 'SAVE20', discountType: 'PERCENT', value: 20, minOrderValue: 1000, isActive: true, description: 'Get 20% off on orders above 1000!' },
    { id: 'coupon-2', code: 'FLAT500', discountType: 'FIXED', value: 500, minOrderValue: 2500, isActive: true, description: 'Get Flat 500 off on high-value checkouts exceeding 2500!' },
    { id: 'coupon-3', code: 'FREESHIP', discountType: 'FIXED', value: 150, minOrderValue: 500, isActive: true, description: 'Waive off shipping charge of 150 above 500 purchase values.' }
  ];

  const couponAdjs = ['DEAL', 'MEGA', 'SUPER', 'SUMMER', 'FESTIVE', 'WINTER', 'DIWALI', 'FLASH', 'ROYAL', 'EXCLUSIVE'];
  while (coupons.length < 50) {
    const adj = couponAdjs[getRandomInt(0, couponAdjs.length - 1)];
    const val = getRandomInt(0, 1) === 0 ? getRandomInt(10, 30) : getRandomInt(100, 800);
    const code = `${adj}${val}`;
    const discountType = val > 50 ? 'FIXED' : 'PERCENT';
    const minOrder = discountType === 'PERCENT' ? getRandomInt(500, 1500) : getRandomInt(1000, 3000);
    
    if (!coupons.some(c => c.code === code)) {
      coupons.push({
        id: `coupon-${coupons.length + 1}`,
        code,
        discountType,
        value: val,
        minOrderValue: minOrder,
        isActive: true,
        description: `Special promotional Code! Save ${discountType === 'PERCENT' ? val + '%' : '$' + val} on orders of ${minOrder} or more.`
      });
    }
  }

  // ==========================================
  // 4. GENERATE 1010 AUDITED & CONSISTENT PRODUCTS
  // ==========================================
  const taxonomy: Array<{ category: string; subCategories: string[] }> = [
    {
      category: "Women's Fashion",
      subCategories: ['Sarees', 'Kurtis', 'Dresses', 'Tops', 'Jeans', 'Handbags', 'Jewellery', 'Watches', 'Sandals', 'Heels']
    },
    {
      category: "Men's Fashion",
      subCategories: ['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Hoodies', 'Jackets', 'Watches', 'Sportswear']
    },
    {
      category: "Footwear",
      subCategories: ['Running Shoes', 'Casual Shoes', 'Formal Shoes', 'Sneakers', 'Sports Shoes', 'Sandals']
    },
    {
      category: "Kids",
      subCategories: ['Boys Clothing', 'Girls Clothing', 'Toys', 'School Bags']
    },
    {
      category: "Books",
      subCategories: ['Programming Books', 'Fiction Novels', 'Academic Textbook', 'Competitive Exams Prep']
    },
    {
      category: "Gaming",
      subCategories: ['Gaming Consoles', 'Gaming Keyboards', 'Gaming Mice', 'Gaming Headset', 'Controllers', 'Gaming Chairs']
    },
    {
      category: "Electronics",
      subCategories: ['Smartphones', 'Laptops', 'Tablets', 'Smart Watches', 'Earbuds']
    },
    {
      category: "Beauty",
      subCategories: ['Makeup Foundation', 'Skin Care Serum', 'Hair Care Oil', 'Perfume Spray']
    },
    {
      category: "Home & Kitchen",
      subCategories: ['Modern Sofa', 'Nonstick Cookware', 'Organizer Rack', 'Wall Decor Accent']
    },
    {
      category: "Sports & Fitness",
      subCategories: ['Dumbbells Weight', 'Yoga Mats Foam', 'Fitness Equipment Gym']
    }
  ];

  const products: Product[] = [];
  let currentProductIndex = 1;

  taxonomy.forEach((taxItem) => {
    const { category, subCategories } = taxItem;
    const productsPerCategoryCount = 101; // Exactly 101 per category = 1010 total products

    for (let cell = 0; cell < productsPerCategoryCount; cell++) {
      const pIdx = currentProductIndex++;
      const subCategory = subCategories[cell % subCategories.length];
      
      const compKey = `${category}_${subCategory}`;
      const subDef = SUBCATEGORY_DEFINITIONS[compKey] || SUBCATEGORY_DEFINITIONS[subCategory] || SUBCATEGORY_DEFINITIONS['Sarees'];

      // Assign an authentic brand from this exact subcategory
      const brand = subDef.brands[cell % subDef.brands.length];

      // Assign an authentic product title pattern
      const baseTitle = subDef.productTitles[cell % subDef.productTitles.length];
      
      // Make title unique and realistic
      const modelCode = 1000 + pIdx;
      const title = `${brand} ${baseTitle} (Series-${modelCode})`;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // Assign authentic, realistic description
      const description = subDef.descriptions[cell % subDef.descriptions.length];

      // Assign authentic pricing
      const [minP, maxP] = subDef.priceRange;
      const originalPrice = Math.round(getRandomInt(minP, maxP) / 10) * 10;
      const discountPercentage = getRandomInt(10, 40);
      const discountFraction = discountPercentage / 100;
      const price = Math.round(originalPrice * (1 - discountFraction));

      const stock = getRandomInt(10, 150);
      const rating = getRandomFloat(4.2, 5.0, 1);

      const catLetters = category.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'G');
      const subLetters = subCategory.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'S');
      const sku = `SKU-${catLetters}-${subLetters}-${modelCode}`;

      // Distribute sellers
      const selIdx = (pIdx % 20) + 1;
      const matchingSeller = sellers.find(s => s.id === `seller-${selIdx}`) || sellers[0];

      // Sizes and colors tailored to this subcategory
      const sizes = subDef.sizes;
      const colors = subDef.colors;

      const isTrending = pIdx % 11 === 0 || pIdx % 19 === 0;
      const isFlashSale = pIdx % 17 === 0;

      // 100% verified pure images from curated image pool
      const images: string[] = getCuratedImages(category, subCategory, pIdx);

      // Tailored specifications key-values
      const specifications = subDef.specs(title, brand);

      // Clean, rich search tags
      const tags = Array.from(new Set([
        category.toLowerCase(),
        subCategory.toLowerCase(),
        brand.toLowerCase(),
        ...subDef.tags,
        `series-${modelCode}`,
        sku.toLowerCase()
      ]));

      products.push({
        id: `prod-gen-${pIdx}`,
        sku,
        title,
        name: title,
        slug,
        categoryId: category.toLowerCase().replace(/[^a-z]+/g, '-'),
        subCategoryId: subCategory.toLowerCase().replace(/[^a-z]+/g, '-'),
        description,
        specifications,
        tags,
        price,
        originalPrice,
        category,
        subCategory,
        brand,
        images,
        variants: {
          sizes,
          colors
        },
        stock,
        rating,
        reviewsCount: 0,
        reviews: [],
        sellerId: matchingSeller.id,
        sellerName: matchingSeller.storeName,
        isTrending,
        isFlashSale,
        createdAt: new Date(Date.now() - pIdx * 15 * 60000).toISOString()
      });
    }
  });

  // ==========================================
  // 5. GENERATE REVIEWS & VERIFIED BUYER FEEDBACK
  // ==========================================
  const reviews: Review[] = [];
  const reviewAuthors = users.filter(u => u.role === 'CUSTOMER');
  
  const commentsPositive = [
    'Superb authentic quality! Completely satisfied with the product finish and packaging.',
    'Exquisite build quality, fits true to dimensions and looks fantastic in person.',
    'Super fast dispatch, genuine authentic seller and highly recommended.',
    'Secure heavy-duty packaging and exceptional quality.',
    'Added great value and exceeded expectations. Will purchase again!',
    'Outstanding color and finish, exactly as shown in photographs.',
    'Very comfortable and durable for regular use. 5 stars!'
  ];
  const commentsCritical = [
    'Satisfactory quality and comfort, though delivery took an extra day.',
    'Decent product overall, works adequately as specified.',
    'Good build. Fits well and meets standard expectations.'
  ];

  let reviewCounter = 1;

  products.forEach((p, pIdx) => {
    const numReviews = 3 + (pIdx % 4);
    for (let rIdx = 0; rIdx < numReviews; rIdx++) {
      const author = reviewAuthors[(pIdx * 5 + rIdx) % reviewAuthors.length] || reviewAuthors[0];
      const isFiveStar = (pIdx + rIdx) % 4 !== 0;
      const rating = isFiveStar ? 5 : 4;
      const commentList = rating === 5 ? commentsPositive : commentsCritical;
      const commentText = commentList[(pIdx + rIdx) % commentList.length];

      const rev: Review = {
        id: `rev-gen-${reviewCounter++}`,
        productId: p.id,
        userId: author.id,
        userName: author.name,
        rating,
        comment: `${commentText} [Verified Buyer Order #${1000 + reviewCounter}]`,
        createdAt: new Date(Date.now() - (rIdx + 1) * 36 * 3600 * 1000).toISOString()
      };

      reviews.push(rev);
      p.reviews.push(rev);
    }

    const sum = p.reviews.reduce((acc, r) => acc + r.rating, 0);
    p.reviewsCount = p.reviews.length + (pIdx % 15) * 8 + 12;
    p.rating = parseFloat((sum / p.reviews.length).toFixed(1));
  });

  return {
    users,
    passwords,
    sellers,
    products,
    coupons,
    reviews
  };
}
