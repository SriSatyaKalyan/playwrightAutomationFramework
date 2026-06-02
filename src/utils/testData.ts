export type ProductCatalogData = {
	productNames: string[];
	falcon9Prices: {
		sale: string;
		original: string;
	};
	otherVisiblePrices: string[];
};

export const productCatalogData: ProductCatalogData = {
	productNames: [
		"Falcon 9",
		"Proton Rocket",
		"Proton-M",
		"Saturn V",
		"Falcon Heavy",
	],
	falcon9Prices: {
		sale: "50.00€",
		original: "600.00€",
	},
	otherVisiblePrices: ["15.00€", "120.00€", "143.00€", "4,500,000.00€"],
};
