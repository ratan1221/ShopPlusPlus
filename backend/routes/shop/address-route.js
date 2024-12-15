import express from 'express';

import { addAddress, editAddress, deleteAddress, fetchAllAddress } from "../../controllers/shop/address-controller.js";

const router = express.Router();

router.post("/add", addAddress);
router.get("/get/:userId", fetchAllAddress);
router.delete("/delete/:userId/:addressId", deleteAddress); //fetch the user then fetch addressId to be deleted
router.put("/update/:userId/:addressId", editAddress);

export default router;
