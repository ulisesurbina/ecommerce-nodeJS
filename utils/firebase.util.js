const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

const { ProductImg } = require("../models/productImg.model.js");

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
// Storage service
const storage = getStorage(firebaseApp);

const uploadProductImgs = async (imgs, productId) => {
    try {
        // Map async
        const imgsPromises = imgs.map(async (img) => {
            // Create unique filename
            const [filename, extension] = img.originalname.split(".");
            const productImg = `${
                process.env.NODE_ENV
            }/products/${productId}/${filename}-${Date.now()}.${extension}`;

            const imgRef = ref(storage, productImg);

            const result = await uploadBytes(imgRef, img.buffer);

            return await ProductImg.create({
                productId,
                imgUrl: result.metadata.fullPath,
            });
        });

        await Promise.all(imgsPromises);
    } catch (error) {
        console.log(error);
    }
};

const getProductsImgsUrls = async (products) => {
    // Loop through post to get to the postImgs
    const productWithImgsPromises = products.map(async (product) => {
        // Get images URLs
        const productImgsPromises = product.productImgs.map(
            async (productImg) => {
                const imgRef = ref(storage, productImg.imgUrl);
                const imgUrl = await getDownloadURL(imgRef);

                productImg.imgUrl = imgUrl;
                return productImg;
            }
        );
        // Resolve imgs URL
        const productImgs = await Promise.all(productImgsPromises);
        // Update old postImgs array with new array
        product.productImgs = productImgs;
        return product;
    });
    return await Promise.all(productWithImgsPromises);
};

module.exports = { storage, uploadProductImgs, getProductsImgsUrls };
