import {defineConfig} from "vite";
import { imagetools } from 'vite-imagetools';

/**
 * Path to BestShop folder
 */
const BestShopPath = ".";

/**
 * Don't change those lines below
 */
export default defineConfig({
    root: BestShopPath,
    server: {
        port: 3000,
        open: true,
    },
    plugins: [
        imagetools()
    ],
});