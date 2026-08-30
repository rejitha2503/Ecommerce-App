import { User, Address, Coupon, Seller, Review } from "../types";

export const INITIAL_USERS: User[] = [
  {
    "id": "user-cust-1",
    "email": "rejitha2503@gmail.com",
    "name": "Rejitha Customer",
    "role": "CUSTOMER",
    "rewardPoints": 120,
    "referralCode": "SPHERE120",
    "verified": true,
    "createdAt": "2026-01-15T12:00:00.000Z"
  },
  {
    "id": "user-seller-1",
    "email": "seller@shopsphere.com",
    "name": "Sari Palace Seller",
    "role": "SELLER",
    "rewardPoints": 0,
    "referralCode": "SARIP100",
    "verified": true,
    "createdAt": "2026-01-15T12:00:00.000Z"
  },
  {
    "id": "user-admin-1",
    "email": "admin@shopsphere.com",
    "name": "System Admin",
    "role": "ADMIN",
    "rewardPoints": 5000,
    "referralCode": "ADMIN777",
    "verified": true,
    "createdAt": "2026-01-15T12:00:00.000Z"
  },
  {
    "id": "user-seller-2",
    "email": "seller2@shopsphere.com",
    "name": "Alpha Electronics & Apparel Manager",
    "role": "SELLER",
    "rewardPoints": 168,
    "referralCode": "SELLCODE102",
    "verified": true,
    "createdAt": "2026-08-20T03:57:23.431Z"
  },
  {
    "id": "user-seller-3",
    "email": "seller3@shopsphere.com",
    "name": "TechBazaar India Manager",
    "role": "SELLER",
    "rewardPoints": 302,
    "referralCode": "SELLCODE103",
    "verified": true,
    "createdAt": "2026-08-15T03:57:23.431Z"
  },
  {
    "id": "user-seller-4",
    "email": "seller4@shopsphere.com",
    "name": "StyleTrend Wholesalers Manager",
    "role": "SELLER",
    "rewardPoints": 386,
    "referralCode": "SELLCODE104",
    "verified": true,
    "createdAt": "2026-08-10T03:57:23.431Z"
  },
  {
    "id": "user-seller-5",
    "email": "seller5@shopsphere.com",
    "name": "Bookworm Nest Manager",
    "role": "SELLER",
    "rewardPoints": 137,
    "referralCode": "SELLCODE105",
    "verified": true,
    "createdAt": "2026-08-05T03:57:23.431Z"
  },
  {
    "id": "user-seller-6",
    "email": "seller6@shopsphere.com",
    "name": "Gizmo Outfitters Manager",
    "role": "SELLER",
    "rewardPoints": 385,
    "referralCode": "SELLCODE106",
    "verified": true,
    "createdAt": "2026-07-31T03:57:23.431Z"
  },
  {
    "id": "user-seller-7",
    "email": "seller7@shopsphere.com",
    "name": "Little Feet Kids Manager",
    "role": "SELLER",
    "rewardPoints": 373,
    "referralCode": "SELLCODE107",
    "verified": true,
    "createdAt": "2026-07-26T03:57:23.431Z"
  },
  {
    "id": "user-seller-8",
    "email": "seller8@shopsphere.com",
    "name": "Decors & Wooden Crafts Manager",
    "role": "SELLER",
    "rewardPoints": 287,
    "referralCode": "SELLCODE108",
    "verified": true,
    "createdAt": "2026-07-21T03:57:23.431Z"
  },
  {
    "id": "user-seller-9",
    "email": "seller9@shopsphere.com",
    "name": "Active Life Sports Manager",
    "role": "SELLER",
    "rewardPoints": 63,
    "referralCode": "SELLCODE109",
    "verified": true,
    "createdAt": "2026-07-16T03:57:23.431Z"
  },
  {
    "id": "user-seller-10",
    "email": "seller10@shopsphere.com",
    "name": "Cosmetic Glow Hub Manager",
    "role": "SELLER",
    "rewardPoints": 345,
    "referralCode": "SELLCODE110",
    "verified": true,
    "createdAt": "2026-07-11T03:57:23.431Z"
  },
  {
    "id": "user-seller-11",
    "email": "seller11@shopsphere.com",
    "name": "Urban Denim Mill Manager",
    "role": "SELLER",
    "rewardPoints": 260,
    "referralCode": "SELLCODE111",
    "verified": true,
    "createdAt": "2026-07-06T03:57:23.431Z"
  },
  {
    "id": "user-seller-12",
    "email": "seller12@shopsphere.com",
    "name": "Gamer Zone World Manager",
    "role": "SELLER",
    "rewardPoints": 127,
    "referralCode": "SELLCODE112",
    "verified": true,
    "createdAt": "2026-07-01T03:57:23.431Z"
  },
  {
    "id": "user-seller-13",
    "email": "seller13@shopsphere.com",
    "name": "Silver Line Jewellery Manager",
    "role": "SELLER",
    "rewardPoints": 261,
    "referralCode": "SELLCODE113",
    "verified": true,
    "createdAt": "2026-06-26T03:57:23.431Z"
  },
  {
    "id": "user-seller-14",
    "email": "seller14@shopsphere.com",
    "name": "Modern Home Kitchen Manager",
    "role": "SELLER",
    "rewardPoints": 81,
    "referralCode": "SELLCODE114",
    "verified": true,
    "createdAt": "2026-06-21T03:57:23.431Z"
  },
  {
    "id": "user-seller-15",
    "email": "seller15@shopsphere.com",
    "name": "Elite Soles Formal Footwear Manager",
    "role": "SELLER",
    "rewardPoints": 133,
    "referralCode": "SELLCODE115",
    "verified": true,
    "createdAt": "2026-06-16T03:57:23.431Z"
  },
  {
    "id": "user-seller-16",
    "email": "seller16@shopsphere.com",
    "name": "SuperKids Toy Outlet Manager",
    "role": "SELLER",
    "rewardPoints": 256,
    "referralCode": "SELLCODE116",
    "verified": true,
    "createdAt": "2026-06-11T03:57:23.431Z"
  },
  {
    "id": "user-seller-17",
    "email": "seller17@shopsphere.com",
    "name": "Academica Book Depot Manager",
    "role": "SELLER",
    "rewardPoints": 68,
    "referralCode": "SELLCODE117",
    "verified": true,
    "createdAt": "2026-06-06T03:57:23.431Z"
  },
  {
    "id": "user-seller-18",
    "email": "seller18@shopsphere.com",
    "name": "Swayam Handlooms Manager",
    "role": "SELLER",
    "rewardPoints": 205,
    "referralCode": "SELLCODE118",
    "verified": true,
    "createdAt": "2026-06-01T03:57:23.431Z"
  },
  {
    "id": "user-seller-19",
    "email": "seller19@shopsphere.com",
    "name": "Apex Power Hardware Manager",
    "role": "SELLER",
    "rewardPoints": 305,
    "referralCode": "SELLCODE119",
    "verified": true,
    "createdAt": "2026-05-27T03:57:23.431Z"
  },
  {
    "id": "user-seller-20",
    "email": "seller20@shopsphere.com",
    "name": "Future Gadgets Ltd Manager",
    "role": "SELLER",
    "rewardPoints": 177,
    "referralCode": "SELLCODE120",
    "verified": true,
    "createdAt": "2026-05-22T03:57:23.431Z"
  },
  {
    "id": "user-cust-22",
    "email": "sanjay.rao22@shopsphere.net",
    "name": "Sanjay Rao",
    "role": "CUSTOMER",
    "rewardPoints": 545,
    "referralCode": "SPHERE286",
    "verified": true,
    "createdAt": "2026-06-25T03:57:23.431Z"
  },
  {
    "id": "user-cust-23",
    "email": "rahul.rao23@shopsphere.net",
    "name": "Rahul Rao",
    "role": "CUSTOMER",
    "rewardPoints": 351,
    "referralCode": "SPHERE299",
    "verified": true,
    "createdAt": "2026-06-22T03:57:23.431Z"
  },
  {
    "id": "user-cust-24",
    "email": "shalini.gupta24@shopsphere.net",
    "name": "Shalini Gupta",
    "role": "CUSTOMER",
    "rewardPoints": 433,
    "referralCode": "SPHERE312",
    "verified": true,
    "createdAt": "2026-06-19T03:57:23.431Z"
  },
  {
    "id": "user-cust-25",
    "email": "neelam.chawla25@shopsphere.net",
    "name": "Neelam Chawla",
    "role": "CUSTOMER",
    "rewardPoints": 628,
    "referralCode": "SPHERE325",
    "verified": true,
    "createdAt": "2026-06-16T03:57:23.431Z"
  },
  {
    "id": "user-cust-26",
    "email": "aarav.mehta26@shopsphere.net",
    "name": "Aarav Mehta",
    "role": "CUSTOMER",
    "rewardPoints": 733,
    "referralCode": "SPHERE338",
    "verified": true,
    "createdAt": "2026-06-13T03:57:23.431Z"
  },
  {
    "id": "user-cust-27",
    "email": "amit.chawla27@shopsphere.net",
    "name": "Amit Chawla",
    "role": "CUSTOMER",
    "rewardPoints": 388,
    "referralCode": "SPHERE351",
    "verified": true,
    "createdAt": "2026-06-10T03:57:23.431Z"
  },
  {
    "id": "user-cust-28",
    "email": "aarav.chawla28@shopsphere.net",
    "name": "Aarav Chawla",
    "role": "CUSTOMER",
    "rewardPoints": 30,
    "referralCode": "SPHERE364",
    "verified": true,
    "createdAt": "2026-06-07T03:57:23.431Z"
  },
  {
    "id": "user-cust-29",
    "email": "amit.mehta29@shopsphere.net",
    "name": "Amit Mehta",
    "role": "CUSTOMER",
    "rewardPoints": 266,
    "referralCode": "SPHERE377",
    "verified": true,
    "createdAt": "2026-06-04T03:57:23.431Z"
  },
  {
    "id": "user-cust-30",
    "email": "vikram.reddy30@shopsphere.net",
    "name": "Vikram Reddy",
    "role": "CUSTOMER",
    "rewardPoints": 229,
    "referralCode": "SPHERE390",
    "verified": true,
    "createdAt": "2026-06-01T03:57:23.431Z"
  },
  {
    "id": "user-cust-31",
    "email": "vikram.roy31@shopsphere.net",
    "name": "Vikram Roy",
    "role": "CUSTOMER",
    "rewardPoints": 431,
    "referralCode": "SPHERE403",
    "verified": true,
    "createdAt": "2026-05-29T03:57:23.431Z"
  },
  {
    "id": "user-cust-32",
    "email": "neelam.roy32@shopsphere.net",
    "name": "Neelam Roy",
    "role": "CUSTOMER",
    "rewardPoints": 65,
    "referralCode": "SPHERE416",
    "verified": true,
    "createdAt": "2026-05-26T03:57:23.431Z"
  },
  {
    "id": "user-cust-33",
    "email": "amit.roy33@shopsphere.net",
    "name": "Amit Roy",
    "role": "CUSTOMER",
    "rewardPoints": 699,
    "referralCode": "SPHERE429",
    "verified": true,
    "createdAt": "2026-05-23T03:57:23.431Z"
  },
  {
    "id": "user-cust-34",
    "email": "neelam.mishra34@shopsphere.net",
    "name": "Neelam Mishra",
    "role": "CUSTOMER",
    "rewardPoints": 273,
    "referralCode": "SPHERE442",
    "verified": true,
    "createdAt": "2026-05-20T03:57:23.431Z"
  },
  {
    "id": "user-cust-35",
    "email": "rajesh.roy35@shopsphere.net",
    "name": "Rajesh Roy",
    "role": "CUSTOMER",
    "rewardPoints": 18,
    "referralCode": "SPHERE455",
    "verified": true,
    "createdAt": "2026-05-17T03:57:23.431Z"
  },
  {
    "id": "user-cust-36",
    "email": "meera.mehta36@shopsphere.net",
    "name": "Meera Mehta",
    "role": "CUSTOMER",
    "rewardPoints": 149,
    "referralCode": "SPHERE468",
    "verified": true,
    "createdAt": "2026-05-14T03:57:23.431Z"
  },
  {
    "id": "user-cust-37",
    "email": "sanjay.mishra37@shopsphere.net",
    "name": "Sanjay Mishra",
    "role": "CUSTOMER",
    "rewardPoints": 580,
    "referralCode": "SPHERE481",
    "verified": true,
    "createdAt": "2026-05-11T03:57:23.431Z"
  },
  {
    "id": "user-cust-38",
    "email": "vijay.das38@shopsphere.net",
    "name": "Vijay Das",
    "role": "CUSTOMER",
    "rewardPoints": 687,
    "referralCode": "SPHERE494",
    "verified": true,
    "createdAt": "2026-05-08T03:57:23.431Z"
  },
  {
    "id": "user-cust-39",
    "email": "priya.sen39@shopsphere.net",
    "name": "Priya Sen",
    "role": "CUSTOMER",
    "rewardPoints": 527,
    "referralCode": "SPHERE507",
    "verified": true,
    "createdAt": "2026-05-05T03:57:23.431Z"
  },
  {
    "id": "user-cust-40",
    "email": "kiran.nair40@shopsphere.net",
    "name": "Kiran Nair",
    "role": "CUSTOMER",
    "rewardPoints": 88,
    "referralCode": "SPHERE520",
    "verified": true,
    "createdAt": "2026-05-02T03:57:23.431Z"
  },
  {
    "id": "user-cust-41",
    "email": "anjali.nair41@shopsphere.net",
    "name": "Anjali Nair",
    "role": "CUSTOMER",
    "rewardPoints": 24,
    "referralCode": "SPHERE533",
    "verified": true,
    "createdAt": "2026-04-29T03:57:23.431Z"
  },
  {
    "id": "user-cust-42",
    "email": "deepak.sen42@shopsphere.net",
    "name": "Deepak Sen",
    "role": "CUSTOMER",
    "rewardPoints": 382,
    "referralCode": "SPHERE546",
    "verified": true,
    "createdAt": "2026-04-26T03:57:23.431Z"
  },
  {
    "id": "user-cust-43",
    "email": "vijay.iyer43@shopsphere.net",
    "name": "Vijay Iyer",
    "role": "CUSTOMER",
    "rewardPoints": 164,
    "referralCode": "SPHERE559",
    "verified": true,
    "createdAt": "2026-04-23T03:57:23.431Z"
  },
  {
    "id": "user-cust-44",
    "email": "rohan.reddy44@shopsphere.net",
    "name": "Rohan Reddy",
    "role": "CUSTOMER",
    "rewardPoints": 681,
    "referralCode": "SPHERE572",
    "verified": true,
    "createdAt": "2026-04-20T03:57:23.431Z"
  },
  {
    "id": "user-cust-45",
    "email": "divya.verma45@shopsphere.net",
    "name": "Divya Verma",
    "role": "CUSTOMER",
    "rewardPoints": 218,
    "referralCode": "SPHERE585",
    "verified": true,
    "createdAt": "2026-04-17T03:57:23.431Z"
  },
  {
    "id": "user-cust-46",
    "email": "vikram.mishra46@shopsphere.net",
    "name": "Vikram Mishra",
    "role": "CUSTOMER",
    "rewardPoints": 281,
    "referralCode": "SPHERE598",
    "verified": true,
    "createdAt": "2026-04-14T03:57:23.431Z"
  },
  {
    "id": "user-cust-47",
    "email": "meera.iyer47@shopsphere.net",
    "name": "Meera Iyer",
    "role": "CUSTOMER",
    "rewardPoints": 245,
    "referralCode": "SPHERE611",
    "verified": true,
    "createdAt": "2026-04-11T03:57:23.431Z"
  },
  {
    "id": "user-cust-48",
    "email": "anjali.das48@shopsphere.net",
    "name": "Anjali Das",
    "role": "CUSTOMER",
    "rewardPoints": 226,
    "referralCode": "SPHERE624",
    "verified": true,
    "createdAt": "2026-04-08T03:57:23.431Z"
  },
  {
    "id": "user-cust-49",
    "email": "deepak.more49@shopsphere.net",
    "name": "Deepak More",
    "role": "CUSTOMER",
    "rewardPoints": 69,
    "referralCode": "SPHERE637",
    "verified": true,
    "createdAt": "2026-04-05T03:57:23.431Z"
  },
  {
    "id": "user-cust-50",
    "email": "pooja.reddy50@shopsphere.net",
    "name": "Pooja Reddy",
    "role": "CUSTOMER",
    "rewardPoints": 85,
    "referralCode": "SPHERE650",
    "verified": true,
    "createdAt": "2026-04-02T03:57:23.431Z"
  },
  {
    "id": "user-cust-51",
    "email": "meera.mehta51@shopsphere.net",
    "name": "Meera Mehta",
    "role": "CUSTOMER",
    "rewardPoints": 110,
    "referralCode": "SPHERE663",
    "verified": true,
    "createdAt": "2026-03-30T03:57:23.431Z"
  },
  {
    "id": "user-cust-52",
    "email": "anjali.chawla52@shopsphere.net",
    "name": "Anjali Chawla",
    "role": "CUSTOMER",
    "rewardPoints": 196,
    "referralCode": "SPHERE676",
    "verified": true,
    "createdAt": "2026-03-27T03:57:23.431Z"
  },
  {
    "id": "user-cust-53",
    "email": "aarav.kapoor53@shopsphere.net",
    "name": "Aarav Kapoor",
    "role": "CUSTOMER",
    "rewardPoints": 617,
    "referralCode": "SPHERE689",
    "verified": true,
    "createdAt": "2026-03-24T03:57:23.431Z"
  },
  {
    "id": "user-cust-54",
    "email": "sunita.rao54@shopsphere.net",
    "name": "Sunita Rao",
    "role": "CUSTOMER",
    "rewardPoints": 318,
    "referralCode": "SPHERE702",
    "verified": true,
    "createdAt": "2026-03-21T03:57:23.431Z"
  },
  {
    "id": "user-cust-55",
    "email": "aditi.sen55@shopsphere.net",
    "name": "Aditi Sen",
    "role": "CUSTOMER",
    "rewardPoints": 356,
    "referralCode": "SPHERE715",
    "verified": true,
    "createdAt": "2026-03-18T03:57:23.431Z"
  },
  {
    "id": "user-cust-56",
    "email": "aarav.mishra56@shopsphere.net",
    "name": "Aarav Mishra",
    "role": "CUSTOMER",
    "rewardPoints": 330,
    "referralCode": "SPHERE728",
    "verified": true,
    "createdAt": "2026-03-15T03:57:23.431Z"
  },
  {
    "id": "user-cust-57",
    "email": "rajesh.iyer57@shopsphere.net",
    "name": "Rajesh Iyer",
    "role": "CUSTOMER",
    "rewardPoints": 543,
    "referralCode": "SPHERE741",
    "verified": true,
    "createdAt": "2026-03-12T03:57:23.431Z"
  },
  {
    "id": "user-cust-58",
    "email": "vikram.verma58@shopsphere.net",
    "name": "Vikram Verma",
    "role": "CUSTOMER",
    "rewardPoints": 265,
    "referralCode": "SPHERE754",
    "verified": true,
    "createdAt": "2026-03-09T03:57:23.431Z"
  },
  {
    "id": "user-cust-59",
    "email": "pooja.singh59@shopsphere.net",
    "name": "Pooja Singh",
    "role": "CUSTOMER",
    "rewardPoints": 85,
    "referralCode": "SPHERE767",
    "verified": true,
    "createdAt": "2026-03-06T03:57:23.431Z"
  },
  {
    "id": "user-cust-60",
    "email": "neelam.das60@shopsphere.net",
    "name": "Neelam Das",
    "role": "CUSTOMER",
    "rewardPoints": 182,
    "referralCode": "SPHERE780",
    "verified": true,
    "createdAt": "2026-03-03T03:57:23.431Z"
  },
  {
    "id": "user-cust-61",
    "email": "meera.reddy61@shopsphere.net",
    "name": "Meera Reddy",
    "role": "CUSTOMER",
    "rewardPoints": 587,
    "referralCode": "SPHERE793",
    "verified": true,
    "createdAt": "2026-02-28T03:57:23.431Z"
  },
  {
    "id": "user-cust-62",
    "email": "amit.chawla62@shopsphere.net",
    "name": "Amit Chawla",
    "role": "CUSTOMER",
    "rewardPoints": 535,
    "referralCode": "SPHERE806",
    "verified": true,
    "createdAt": "2026-02-25T03:57:23.431Z"
  },
  {
    "id": "user-cust-63",
    "email": "anjali.sen63@shopsphere.net",
    "name": "Anjali Sen",
    "role": "CUSTOMER",
    "rewardPoints": 312,
    "referralCode": "SPHERE819",
    "verified": true,
    "createdAt": "2026-02-22T03:57:23.431Z"
  },
  {
    "id": "user-cust-64",
    "email": "neelam.rao64@shopsphere.net",
    "name": "Neelam Rao",
    "role": "CUSTOMER",
    "rewardPoints": 479,
    "referralCode": "SPHERE832",
    "verified": true,
    "createdAt": "2026-02-19T03:57:23.431Z"
  },
  {
    "id": "user-cust-65",
    "email": "sanjay.singh65@shopsphere.net",
    "name": "Sanjay Singh",
    "role": "CUSTOMER",
    "rewardPoints": 606,
    "referralCode": "SPHERE845",
    "verified": true,
    "createdAt": "2026-02-16T03:57:23.431Z"
  },
  {
    "id": "user-cust-66",
    "email": "shalini.more66@shopsphere.net",
    "name": "Shalini More",
    "role": "CUSTOMER",
    "rewardPoints": 374,
    "referralCode": "SPHERE858",
    "verified": true,
    "createdAt": "2026-02-13T03:57:23.431Z"
  },
  {
    "id": "user-cust-67",
    "email": "anjali.chawla67@shopsphere.net",
    "name": "Anjali Chawla",
    "role": "CUSTOMER",
    "rewardPoints": 281,
    "referralCode": "SPHERE871",
    "verified": true,
    "createdAt": "2026-02-10T03:57:23.431Z"
  },
  {
    "id": "user-cust-68",
    "email": "aditi.mishra68@shopsphere.net",
    "name": "Aditi Mishra",
    "role": "CUSTOMER",
    "rewardPoints": 108,
    "referralCode": "SPHERE884",
    "verified": true,
    "createdAt": "2026-02-07T03:57:23.431Z"
  },
  {
    "id": "user-cust-69",
    "email": "sunita.verma69@shopsphere.net",
    "name": "Sunita Verma",
    "role": "CUSTOMER",
    "rewardPoints": 460,
    "referralCode": "SPHERE897",
    "verified": true,
    "createdAt": "2026-02-04T03:57:23.431Z"
  },
  {
    "id": "user-cust-70",
    "email": "amit.das70@shopsphere.net",
    "name": "Amit Das",
    "role": "CUSTOMER",
    "rewardPoints": 561,
    "referralCode": "SPHERE910",
    "verified": true,
    "createdAt": "2026-02-01T03:57:23.431Z"
  },
  {
    "id": "user-cust-71",
    "email": "anjali.bannerjee71@shopsphere.net",
    "name": "Anjali Bannerjee",
    "role": "CUSTOMER",
    "rewardPoints": 560,
    "referralCode": "SPHERE923",
    "verified": true,
    "createdAt": "2026-01-29T03:57:23.431Z"
  },
  {
    "id": "user-cust-72",
    "email": "aarav.das72@shopsphere.net",
    "name": "Aarav Das",
    "role": "CUSTOMER",
    "rewardPoints": 735,
    "referralCode": "SPHERE936",
    "verified": true,
    "createdAt": "2026-01-26T03:57:23.431Z"
  },
  {
    "id": "user-cust-73",
    "email": "vijay.joshi73@shopsphere.net",
    "name": "Vijay Joshi",
    "role": "CUSTOMER",
    "rewardPoints": 659,
    "referralCode": "SPHERE949",
    "verified": true,
    "createdAt": "2026-01-23T03:57:23.431Z"
  },
  {
    "id": "user-cust-74",
    "email": "rohan.reddy74@shopsphere.net",
    "name": "Rohan Reddy",
    "role": "CUSTOMER",
    "rewardPoints": 38,
    "referralCode": "SPHERE962",
    "verified": true,
    "createdAt": "2026-01-20T03:57:23.431Z"
  },
  {
    "id": "user-cust-75",
    "email": "sunita.more75@shopsphere.net",
    "name": "Sunita More",
    "role": "CUSTOMER",
    "rewardPoints": 433,
    "referralCode": "SPHERE975",
    "verified": true,
    "createdAt": "2026-01-17T03:57:23.431Z"
  },
  {
    "id": "user-cust-76",
    "email": "aditi.singh76@shopsphere.net",
    "name": "Aditi Singh",
    "role": "CUSTOMER",
    "rewardPoints": 43,
    "referralCode": "SPHERE988",
    "verified": true,
    "createdAt": "2026-01-14T03:57:23.431Z"
  },
  {
    "id": "user-cust-77",
    "email": "meera.bannerjee77@shopsphere.net",
    "name": "Meera Bannerjee",
    "role": "CUSTOMER",
    "rewardPoints": 30,
    "referralCode": "SPHERE1001",
    "verified": true,
    "createdAt": "2026-01-11T03:57:23.431Z"
  },
  {
    "id": "user-cust-78",
    "email": "priya.mishra78@shopsphere.net",
    "name": "Priya Mishra",
    "role": "CUSTOMER",
    "rewardPoints": 335,
    "referralCode": "SPHERE1014",
    "verified": true,
    "createdAt": "2026-01-08T03:57:23.431Z"
  },
  {
    "id": "user-cust-79",
    "email": "divya.more79@shopsphere.net",
    "name": "Divya More",
    "role": "CUSTOMER",
    "rewardPoints": 68,
    "referralCode": "SPHERE1027",
    "verified": true,
    "createdAt": "2026-01-05T03:57:23.431Z"
  },
  {
    "id": "user-cust-80",
    "email": "vijay.chawla80@shopsphere.net",
    "name": "Vijay Chawla",
    "role": "CUSTOMER",
    "rewardPoints": 787,
    "referralCode": "SPHERE1040",
    "verified": true,
    "createdAt": "2026-01-02T03:57:23.431Z"
  },
  {
    "id": "user-cust-81",
    "email": "vikram.chawla81@shopsphere.net",
    "name": "Vikram Chawla",
    "role": "CUSTOMER",
    "rewardPoints": 575,
    "referralCode": "SPHERE1053",
    "verified": true,
    "createdAt": "2025-12-30T03:57:23.431Z"
  },
  {
    "id": "user-cust-82",
    "email": "aarav.roy82@shopsphere.net",
    "name": "Aarav Roy",
    "role": "CUSTOMER",
    "rewardPoints": 85,
    "referralCode": "SPHERE1066",
    "verified": true,
    "createdAt": "2025-12-27T03:57:23.431Z"
  },
  {
    "id": "user-cust-83",
    "email": "rohan.gupta83@shopsphere.net",
    "name": "Rohan Gupta",
    "role": "CUSTOMER",
    "rewardPoints": 126,
    "referralCode": "SPHERE1079",
    "verified": true,
    "createdAt": "2025-12-24T03:57:23.431Z"
  },
  {
    "id": "user-cust-84",
    "email": "sunita.nair84@shopsphere.net",
    "name": "Sunita Nair",
    "role": "CUSTOMER",
    "rewardPoints": 357,
    "referralCode": "SPHERE1092",
    "verified": true,
    "createdAt": "2025-12-21T03:57:23.431Z"
  },
  {
    "id": "user-cust-85",
    "email": "siddharth.chawla85@shopsphere.net",
    "name": "Siddharth Chawla",
    "role": "CUSTOMER",
    "rewardPoints": 41,
    "referralCode": "SPHERE1105",
    "verified": true,
    "createdAt": "2025-12-18T03:57:23.431Z"
  },
  {
    "id": "user-cust-86",
    "email": "shalini.das86@shopsphere.net",
    "name": "Shalini Das",
    "role": "CUSTOMER",
    "rewardPoints": 582,
    "referralCode": "SPHERE1118",
    "verified": true,
    "createdAt": "2025-12-15T03:57:23.431Z"
  },
  {
    "id": "user-cust-87",
    "email": "sunita.more87@shopsphere.net",
    "name": "Sunita More",
    "role": "CUSTOMER",
    "rewardPoints": 237,
    "referralCode": "SPHERE1131",
    "verified": true,
    "createdAt": "2025-12-12T03:57:23.431Z"
  },
  {
    "id": "user-cust-88",
    "email": "priya.sharma88@shopsphere.net",
    "name": "Priya Sharma",
    "role": "CUSTOMER",
    "rewardPoints": 161,
    "referralCode": "SPHERE1144",
    "verified": true,
    "createdAt": "2025-12-09T03:57:23.431Z"
  },
  {
    "id": "user-cust-89",
    "email": "amit.kapoor89@shopsphere.net",
    "name": "Amit Kapoor",
    "role": "CUSTOMER",
    "rewardPoints": 147,
    "referralCode": "SPHERE1157",
    "verified": true,
    "createdAt": "2025-12-06T03:57:23.431Z"
  },
  {
    "id": "user-cust-90",
    "email": "rahul.roy90@shopsphere.net",
    "name": "Rahul Roy",
    "role": "CUSTOMER",
    "rewardPoints": 508,
    "referralCode": "SPHERE1170",
    "verified": true,
    "createdAt": "2025-12-03T03:57:23.431Z"
  },
  {
    "id": "user-cust-91",
    "email": "priya.gupta91@shopsphere.net",
    "name": "Priya Gupta",
    "role": "CUSTOMER",
    "rewardPoints": 589,
    "referralCode": "SPHERE1183",
    "verified": true,
    "createdAt": "2025-11-30T03:57:23.431Z"
  },
  {
    "id": "user-cust-92",
    "email": "meera.chawla92@shopsphere.net",
    "name": "Meera Chawla",
    "role": "CUSTOMER",
    "rewardPoints": 793,
    "referralCode": "SPHERE1196",
    "verified": true,
    "createdAt": "2025-11-27T03:57:23.431Z"
  },
  {
    "id": "user-cust-93",
    "email": "pooja.das93@shopsphere.net",
    "name": "Pooja Das",
    "role": "CUSTOMER",
    "rewardPoints": 494,
    "referralCode": "SPHERE1209",
    "verified": true,
    "createdAt": "2025-11-24T03:57:23.431Z"
  },
  {
    "id": "user-cust-94",
    "email": "sanjay.reddy94@shopsphere.net",
    "name": "Sanjay Reddy",
    "role": "CUSTOMER",
    "rewardPoints": 526,
    "referralCode": "SPHERE1222",
    "verified": true,
    "createdAt": "2025-11-21T03:57:23.431Z"
  },
  {
    "id": "user-cust-95",
    "email": "vikram.pathak95@shopsphere.net",
    "name": "Vikram Pathak",
    "role": "CUSTOMER",
    "rewardPoints": 769,
    "referralCode": "SPHERE1235",
    "verified": true,
    "createdAt": "2025-11-18T03:57:23.431Z"
  },
  {
    "id": "user-cust-96",
    "email": "rajesh.roy96@shopsphere.net",
    "name": "Rajesh Roy",
    "role": "CUSTOMER",
    "rewardPoints": 227,
    "referralCode": "SPHERE1248",
    "verified": true,
    "createdAt": "2025-11-15T03:57:23.431Z"
  },
  {
    "id": "user-cust-97",
    "email": "sanjay.singh97@shopsphere.net",
    "name": "Sanjay Singh",
    "role": "CUSTOMER",
    "rewardPoints": 468,
    "referralCode": "SPHERE1261",
    "verified": true,
    "createdAt": "2025-11-12T03:57:23.431Z"
  },
  {
    "id": "user-cust-98",
    "email": "amit.mishra98@shopsphere.net",
    "name": "Amit Mishra",
    "role": "CUSTOMER",
    "rewardPoints": 211,
    "referralCode": "SPHERE1274",
    "verified": true,
    "createdAt": "2025-11-09T03:57:23.431Z"
  },
  {
    "id": "user-cust-99",
    "email": "aarav.chawla99@shopsphere.net",
    "name": "Aarav Chawla",
    "role": "CUSTOMER",
    "rewardPoints": 700,
    "referralCode": "SPHERE1287",
    "verified": true,
    "createdAt": "2025-11-06T03:57:23.431Z"
  }
];
export const INITIAL_COUPONS: Coupon[] = [
  {
    "id": "coupon-1",
    "code": "SAVE20",
    "discountType": "PERCENT",
    "value": 20,
    "minOrderValue": 1000,
    "isActive": true,
    "description": "Get 20% off on orders above 1000!"
  },
  {
    "id": "coupon-2",
    "code": "FLAT500",
    "discountType": "FIXED",
    "value": 500,
    "minOrderValue": 2500,
    "isActive": true,
    "description": "Get Flat 500 off on high-value checkouts exceeding 2500!"
  },
  {
    "id": "coupon-3",
    "code": "FREESHIP",
    "discountType": "FIXED",
    "value": 150,
    "minOrderValue": 500,
    "isActive": true,
    "description": "Waive off shipping charge of 150 above 500 purchase values."
  },
  {
    "id": "coupon-4",
    "code": "DEAL541",
    "discountType": "FIXED",
    "value": 541,
    "minOrderValue": 2822,
    "isActive": true,
    "description": "Special promotional Code! Save $541 on orders of 2822 or more."
  },
  {
    "id": "coupon-5",
    "code": "MEGA30",
    "discountType": "PERCENT",
    "value": 30,
    "minOrderValue": 1058,
    "isActive": true,
    "description": "Special promotional Code! Save 30% on orders of 1058 or more."
  },
  {
    "id": "coupon-6",
    "code": "ROYAL18",
    "discountType": "PERCENT",
    "value": 18,
    "minOrderValue": 516,
    "isActive": true,
    "description": "Special promotional Code! Save 18% on orders of 516 or more."
  },
  {
    "id": "coupon-7",
    "code": "SUMMER343",
    "discountType": "FIXED",
    "value": 343,
    "minOrderValue": 2071,
    "isActive": true,
    "description": "Special promotional Code! Save $343 on orders of 2071 or more."
  },
  {
    "id": "coupon-8",
    "code": "FESTIVE13",
    "discountType": "PERCENT",
    "value": 13,
    "minOrderValue": 1328,
    "isActive": true,
    "description": "Special promotional Code! Save 13% on orders of 1328 or more."
  },
  {
    "id": "coupon-9",
    "code": "WINTER19",
    "discountType": "PERCENT",
    "value": 19,
    "minOrderValue": 1281,
    "isActive": true,
    "description": "Special promotional Code! Save 19% on orders of 1281 or more."
  },
  {
    "id": "coupon-10",
    "code": "FESTIVE23",
    "discountType": "PERCENT",
    "value": 23,
    "minOrderValue": 525,
    "isActive": true,
    "description": "Special promotional Code! Save 23% on orders of 525 or more."
  },
  {
    "id": "coupon-11",
    "code": "MEGA22",
    "discountType": "PERCENT",
    "value": 22,
    "minOrderValue": 572,
    "isActive": true,
    "description": "Special promotional Code! Save 22% on orders of 572 or more."
  },
  {
    "id": "coupon-12",
    "code": "SUMMER11",
    "discountType": "PERCENT",
    "value": 11,
    "minOrderValue": 1349,
    "isActive": true,
    "description": "Special promotional Code! Save 11% on orders of 1349 or more."
  },
  {
    "id": "coupon-13",
    "code": "WINTER693",
    "discountType": "FIXED",
    "value": 693,
    "minOrderValue": 2142,
    "isActive": true,
    "description": "Special promotional Code! Save $693 on orders of 2142 or more."
  },
  {
    "id": "coupon-14",
    "code": "EXCLUSIVE26",
    "discountType": "PERCENT",
    "value": 26,
    "minOrderValue": 1048,
    "isActive": true,
    "description": "Special promotional Code! Save 26% on orders of 1048 or more."
  },
  {
    "id": "coupon-15",
    "code": "ROYAL259",
    "discountType": "FIXED",
    "value": 259,
    "minOrderValue": 2126,
    "isActive": true,
    "description": "Special promotional Code! Save $259 on orders of 2126 or more."
  },
  {
    "id": "coupon-16",
    "code": "SUMMER734",
    "discountType": "FIXED",
    "value": 734,
    "minOrderValue": 1474,
    "isActive": true,
    "description": "Special promotional Code! Save $734 on orders of 1474 or more."
  },
  {
    "id": "coupon-17",
    "code": "FLASH26",
    "discountType": "PERCENT",
    "value": 26,
    "minOrderValue": 987,
    "isActive": true,
    "description": "Special promotional Code! Save 26% on orders of 987 or more."
  },
  {
    "id": "coupon-18",
    "code": "FESTIVE10",
    "discountType": "PERCENT",
    "value": 10,
    "minOrderValue": 792,
    "isActive": true,
    "description": "Special promotional Code! Save 10% on orders of 792 or more."
  },
  {
    "id": "coupon-19",
    "code": "FESTIVE15",
    "discountType": "PERCENT",
    "value": 15,
    "minOrderValue": 812,
    "isActive": true,
    "description": "Special promotional Code! Save 15% on orders of 812 or more."
  },
  {
    "id": "coupon-20",
    "code": "MEGA628",
    "discountType": "FIXED",
    "value": 628,
    "minOrderValue": 1968,
    "isActive": true,
    "description": "Special promotional Code! Save $628 on orders of 1968 or more."
  },
  {
    "id": "coupon-21",
    "code": "MEGA748",
    "discountType": "FIXED",
    "value": 748,
    "minOrderValue": 1484,
    "isActive": true,
    "description": "Special promotional Code! Save $748 on orders of 1484 or more."
  },
  {
    "id": "coupon-22",
    "code": "SUPER763",
    "discountType": "FIXED",
    "value": 763,
    "minOrderValue": 1788,
    "isActive": true,
    "description": "Special promotional Code! Save $763 on orders of 1788 or more."
  },
  {
    "id": "coupon-23",
    "code": "DIWALI15",
    "discountType": "PERCENT",
    "value": 15,
    "minOrderValue": 958,
    "isActive": true,
    "description": "Special promotional Code! Save 15% on orders of 958 or more."
  },
  {
    "id": "coupon-24",
    "code": "FLASH12",
    "discountType": "PERCENT",
    "value": 12,
    "minOrderValue": 732,
    "isActive": true,
    "description": "Special promotional Code! Save 12% on orders of 732 or more."
  },
  {
    "id": "coupon-25",
    "code": "MEGA13",
    "discountType": "PERCENT",
    "value": 13,
    "minOrderValue": 907,
    "isActive": true,
    "description": "Special promotional Code! Save 13% on orders of 907 or more."
  },
  {
    "id": "coupon-26",
    "code": "ROYAL24",
    "discountType": "PERCENT",
    "value": 24,
    "minOrderValue": 1265,
    "isActive": true,
    "description": "Special promotional Code! Save 24% on orders of 1265 or more."
  },
  {
    "id": "coupon-27",
    "code": "FESTIVE206",
    "discountType": "FIXED",
    "value": 206,
    "minOrderValue": 1555,
    "isActive": true,
    "description": "Special promotional Code! Save $206 on orders of 1555 or more."
  },
  {
    "id": "coupon-28",
    "code": "WINTER13",
    "discountType": "PERCENT",
    "value": 13,
    "minOrderValue": 936,
    "isActive": true,
    "description": "Special promotional Code! Save 13% on orders of 936 or more."
  },
  {
    "id": "coupon-29",
    "code": "WINTER29",
    "discountType": "PERCENT",
    "value": 29,
    "minOrderValue": 544,
    "isActive": true,
    "description": "Special promotional Code! Save 29% on orders of 544 or more."
  },
  {
    "id": "coupon-30",
    "code": "DIWALI138",
    "discountType": "FIXED",
    "value": 138,
    "minOrderValue": 1406,
    "isActive": true,
    "description": "Special promotional Code! Save $138 on orders of 1406 or more."
  },
  {
    "id": "coupon-31",
    "code": "WINTER382",
    "discountType": "FIXED",
    "value": 382,
    "minOrderValue": 2539,
    "isActive": true,
    "description": "Special promotional Code! Save $382 on orders of 2539 or more."
  },
  {
    "id": "coupon-32",
    "code": "EXCLUSIVE535",
    "discountType": "FIXED",
    "value": 535,
    "minOrderValue": 2755,
    "isActive": true,
    "description": "Special promotional Code! Save $535 on orders of 2755 or more."
  },
  {
    "id": "coupon-33",
    "code": "ROYAL423",
    "discountType": "FIXED",
    "value": 423,
    "minOrderValue": 1427,
    "isActive": true,
    "description": "Special promotional Code! Save $423 on orders of 1427 or more."
  },
  {
    "id": "coupon-34",
    "code": "SUPER281",
    "discountType": "FIXED",
    "value": 281,
    "minOrderValue": 1189,
    "isActive": true,
    "description": "Special promotional Code! Save $281 on orders of 1189 or more."
  },
  {
    "id": "coupon-35",
    "code": "SUPER696",
    "discountType": "FIXED",
    "value": 696,
    "minOrderValue": 2012,
    "isActive": true,
    "description": "Special promotional Code! Save $696 on orders of 2012 or more."
  },
  {
    "id": "coupon-36",
    "code": "DIWALI354",
    "discountType": "FIXED",
    "value": 354,
    "minOrderValue": 2458,
    "isActive": true,
    "description": "Special promotional Code! Save $354 on orders of 2458 or more."
  },
  {
    "id": "coupon-37",
    "code": "DIWALI153",
    "discountType": "FIXED",
    "value": 153,
    "minOrderValue": 1187,
    "isActive": true,
    "description": "Special promotional Code! Save $153 on orders of 1187 or more."
  },
  {
    "id": "coupon-38",
    "code": "DIWALI21",
    "discountType": "PERCENT",
    "value": 21,
    "minOrderValue": 653,
    "isActive": true,
    "description": "Special promotional Code! Save 21% on orders of 653 or more."
  },
  {
    "id": "coupon-39",
    "code": "FLASH13",
    "discountType": "PERCENT",
    "value": 13,
    "minOrderValue": 1441,
    "isActive": true,
    "description": "Special promotional Code! Save 13% on orders of 1441 or more."
  },
  {
    "id": "coupon-40",
    "code": "DEAL488",
    "discountType": "FIXED",
    "value": 488,
    "minOrderValue": 2220,
    "isActive": true,
    "description": "Special promotional Code! Save $488 on orders of 2220 or more."
  },
  {
    "id": "coupon-41",
    "code": "FESTIVE621",
    "discountType": "FIXED",
    "value": 621,
    "minOrderValue": 1252,
    "isActive": true,
    "description": "Special promotional Code! Save $621 on orders of 1252 or more."
  },
  {
    "id": "coupon-42",
    "code": "WINTER23",
    "discountType": "PERCENT",
    "value": 23,
    "minOrderValue": 521,
    "isActive": true,
    "description": "Special promotional Code! Save 23% on orders of 521 or more."
  },
  {
    "id": "coupon-43",
    "code": "SUPER161",
    "discountType": "FIXED",
    "value": 161,
    "minOrderValue": 1194,
    "isActive": true,
    "description": "Special promotional Code! Save $161 on orders of 1194 or more."
  },
  {
    "id": "coupon-44",
    "code": "SUMMER24",
    "discountType": "PERCENT",
    "value": 24,
    "minOrderValue": 874,
    "isActive": true,
    "description": "Special promotional Code! Save 24% on orders of 874 or more."
  },
  {
    "id": "coupon-45",
    "code": "SUPER253",
    "discountType": "FIXED",
    "value": 253,
    "minOrderValue": 1466,
    "isActive": true,
    "description": "Special promotional Code! Save $253 on orders of 1466 or more."
  },
  {
    "id": "coupon-46",
    "code": "DEAL353",
    "discountType": "FIXED",
    "value": 353,
    "minOrderValue": 1511,
    "isActive": true,
    "description": "Special promotional Code! Save $353 on orders of 1511 or more."
  },
  {
    "id": "coupon-47",
    "code": "ROYAL741",
    "discountType": "FIXED",
    "value": 741,
    "minOrderValue": 2532,
    "isActive": true,
    "description": "Special promotional Code! Save $741 on orders of 2532 or more."
  },
  {
    "id": "coupon-48",
    "code": "WINTER412",
    "discountType": "FIXED",
    "value": 412,
    "minOrderValue": 1546,
    "isActive": true,
    "description": "Special promotional Code! Save $412 on orders of 1546 or more."
  },
  {
    "id": "coupon-49",
    "code": "SUMMER20",
    "discountType": "PERCENT",
    "value": 20,
    "minOrderValue": 915,
    "isActive": true,
    "description": "Special promotional Code! Save 20% on orders of 915 or more."
  },
  {
    "id": "coupon-50",
    "code": "EXCLUSIVE280",
    "discountType": "FIXED",
    "value": 280,
    "minOrderValue": 1559,
    "isActive": true,
    "description": "Special promotional Code! Save $280 on orders of 1559 or more."
  }
];
export const INITIAL_SELLERS: Seller[] = [
  {
    "id": "seller-1",
    "userId": "user-seller-1",
    "storeName": "Sari Palace Ltd",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #1",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-08-20T03:57:23.431Z"
  },
  {
    "id": "seller-2",
    "userId": "user-seller-2",
    "storeName": "Alpha Electronics & Apparel",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #2",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-08-10T03:57:23.431Z"
  },
  {
    "id": "seller-3",
    "userId": "user-seller-3",
    "storeName": "TechBazaar India",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #3",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-07-31T03:57:23.431Z"
  },
  {
    "id": "seller-4",
    "userId": "user-seller-4",
    "storeName": "StyleTrend Wholesalers",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #4",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-07-21T03:57:23.431Z"
  },
  {
    "id": "seller-5",
    "userId": "user-seller-5",
    "storeName": "Bookworm Nest",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #5",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-07-11T03:57:23.431Z"
  },
  {
    "id": "seller-6",
    "userId": "user-seller-6",
    "storeName": "Gizmo Outfitters",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #6",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-07-01T03:57:23.431Z"
  },
  {
    "id": "seller-7",
    "userId": "user-seller-7",
    "storeName": "Little Feet Kids",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #7",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-06-21T03:57:23.431Z"
  },
  {
    "id": "seller-8",
    "userId": "user-seller-8",
    "storeName": "Decors & Wooden Crafts",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #8",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-06-11T03:57:23.431Z"
  },
  {
    "id": "seller-9",
    "userId": "user-seller-9",
    "storeName": "Active Life Sports",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #9",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-06-01T03:57:23.431Z"
  },
  {
    "id": "seller-10",
    "userId": "user-seller-10",
    "storeName": "Cosmetic Glow Hub",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #10",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-05-22T03:57:23.431Z"
  },
  {
    "id": "seller-11",
    "userId": "user-seller-11",
    "storeName": "Urban Denim Mill",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #11",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-05-12T03:57:23.431Z"
  },
  {
    "id": "seller-12",
    "userId": "user-seller-12",
    "storeName": "Gamer Zone World",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #12",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-05-02T03:57:23.431Z"
  },
  {
    "id": "seller-13",
    "userId": "user-seller-13",
    "storeName": "Silver Line Jewellery",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #13",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-04-22T03:57:23.431Z"
  },
  {
    "id": "seller-14",
    "userId": "user-seller-14",
    "storeName": "Modern Home Kitchen",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #14",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-04-12T03:57:23.431Z"
  },
  {
    "id": "seller-15",
    "userId": "user-seller-15",
    "storeName": "Elite Soles Formal Footwear",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #15",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-04-02T03:57:23.431Z"
  },
  {
    "id": "seller-16",
    "userId": "user-seller-16",
    "storeName": "SuperKids Toy Outlet",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #16",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-03-23T03:57:23.431Z"
  },
  {
    "id": "seller-17",
    "userId": "user-seller-17",
    "storeName": "Academica Book Depot",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #17",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-03-13T03:57:23.431Z"
  },
  {
    "id": "seller-18",
    "userId": "user-seller-18",
    "storeName": "Swayam Handlooms",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #18",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-03-03T03:57:23.431Z"
  },
  {
    "id": "seller-19",
    "userId": "user-seller-19",
    "storeName": "Apex Power Hardware",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #19",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-02-21T03:57:23.431Z"
  },
  {
    "id": "seller-20",
    "userId": "user-seller-20",
    "storeName": "Future Gadgets Ltd",
    "description": "Official verified merchant providing genuine authentic branded products on ShopSphere with verified manufacturer warranties. Store #20",
    "kycStatus": "APPROVED",
    "joinedAt": "2026-02-11T03:57:23.431Z"
  }
];
export const INITIAL_ADDRESSES: Address[] = [
  {
    "id": "addr-1",
    "userId": "user-cust-1",
    "fullName": "Rejitha Customer",
    "phone": "+919876543210",
    "street": "102, Shanti Vihar Complex, JP Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400053",
    "isDefault": true
  }
];
export const INITIAL_PASSWORDS: Record<string, string> = {
  "user-cust-1": "customer123",
  "user-seller-1": "seller123",
  "user-admin-1": "admin123",
  "user-seller-2": "seller123",
  "user-seller-3": "seller123",
  "user-seller-4": "seller123",
  "user-seller-5": "seller123",
  "user-seller-6": "seller123",
  "user-seller-7": "seller123",
  "user-seller-8": "seller123",
  "user-seller-9": "seller123",
  "user-seller-10": "seller123",
  "user-seller-11": "seller123",
  "user-seller-12": "seller123",
  "user-seller-13": "seller123",
  "user-seller-14": "seller123",
  "user-seller-15": "seller123",
  "user-seller-16": "seller123",
  "user-seller-17": "seller123",
  "user-seller-18": "seller123",
  "user-seller-19": "seller123",
  "user-seller-20": "seller123",
  "user-cust-22": "customer123",
  "user-cust-23": "customer123",
  "user-cust-24": "customer123",
  "user-cust-25": "customer123",
  "user-cust-26": "customer123",
  "user-cust-27": "customer123",
  "user-cust-28": "customer123",
  "user-cust-29": "customer123",
  "user-cust-30": "customer123",
  "user-cust-31": "customer123",
  "user-cust-32": "customer123",
  "user-cust-33": "customer123",
  "user-cust-34": "customer123",
  "user-cust-35": "customer123",
  "user-cust-36": "customer123",
  "user-cust-37": "customer123",
  "user-cust-38": "customer123",
  "user-cust-39": "customer123",
  "user-cust-40": "customer123",
  "user-cust-41": "customer123",
  "user-cust-42": "customer123",
  "user-cust-43": "customer123",
  "user-cust-44": "customer123",
  "user-cust-45": "customer123",
  "user-cust-46": "customer123",
  "user-cust-47": "customer123",
  "user-cust-48": "customer123",
  "user-cust-49": "customer123",
  "user-cust-50": "customer123",
  "user-cust-51": "customer123",
  "user-cust-52": "customer123",
  "user-cust-53": "customer123",
  "user-cust-54": "customer123",
  "user-cust-55": "customer123",
  "user-cust-56": "customer123",
  "user-cust-57": "customer123",
  "user-cust-58": "customer123",
  "user-cust-59": "customer123",
  "user-cust-60": "customer123",
  "user-cust-61": "customer123",
  "user-cust-62": "customer123",
  "user-cust-63": "customer123",
  "user-cust-64": "customer123",
  "user-cust-65": "customer123",
  "user-cust-66": "customer123",
  "user-cust-67": "customer123",
  "user-cust-68": "customer123",
  "user-cust-69": "customer123",
  "user-cust-70": "customer123",
  "user-cust-71": "customer123",
  "user-cust-72": "customer123",
  "user-cust-73": "customer123",
  "user-cust-74": "customer123",
  "user-cust-75": "customer123",
  "user-cust-76": "customer123",
  "user-cust-77": "customer123",
  "user-cust-78": "customer123",
  "user-cust-79": "customer123",
  "user-cust-80": "customer123",
  "user-cust-81": "customer123",
  "user-cust-82": "customer123",
  "user-cust-83": "customer123",
  "user-cust-84": "customer123",
  "user-cust-85": "customer123",
  "user-cust-86": "customer123",
  "user-cust-87": "customer123",
  "user-cust-88": "customer123",
  "user-cust-89": "customer123",
  "user-cust-90": "customer123",
  "user-cust-91": "customer123",
  "user-cust-92": "customer123",
  "user-cust-93": "customer123",
  "user-cust-94": "customer123",
  "user-cust-95": "customer123",
  "user-cust-96": "customer123",
  "user-cust-97": "customer123",
  "user-cust-98": "customer123",
  "user-cust-99": "customer123"
};
