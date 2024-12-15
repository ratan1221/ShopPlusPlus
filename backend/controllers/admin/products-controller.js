import { imageUploadUtils } from "../../helpers/cloudinary.js";
import Product from "../../models/Product.js";

//image upload logic

export const handleImageUpload = async (req, res) => {
    try {
        // Validate request
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // Convert file to base64
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const uploadResult = await imageUploadUtils(url);

        if (!uploadResult.success) {
            return res.status(400).json({
                success: false,
                message: uploadResult.message
            });
        }

        return res.status(200).json({
            success: true,
            result: uploadResult.result
        });

    } catch (error) {
        console.error('Image upload error:', error);
        return res.status(500).json({
            success: false,
            message: "Error uploading image to Cloudinary"
        });
    }
};

//add new product
export const addProduct = async (req, res) => {
    try {
        const {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
        } = req.body;

        const newlyCreatedProduct = new Product({
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
        });

        await newlyCreatedProduct.save();
        res.status(201).json({
            success: true,
            data: newlyCreatedProduct
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error occured while adding a product'
        })
    }
}





//fetch all products
export const fetchAllProducts = async (req, res) => {
    try {
        const listOfProducts = await Product.find({});
        res.status(200).json({
            success: true,
            data: listOfProducts
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error occured while fetching  product'
        })
    }
}




///edit product
export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview,
        } = req.body;

        let findProduct = await Product.findById(id);
        if (!findProduct)
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });

        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price === "" ? 0 : price || findProduct.price;
        findProduct.salePrice =
            salePrice === "" ? 0 : salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;
        findProduct.image = image || findProduct.image;
        findProduct.averageReview = averageReview || findProduct.averageReview;

        await findProduct.save();
        res.status(200).json({
            success: true,
            data: findProduct,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error occured",
        });
    }
};



//delete product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product)
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });

        res.status(200).json({
            success: true,
            message: "Product Deleted successfully",
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error occured while deleting a product'
        })
    }
}
