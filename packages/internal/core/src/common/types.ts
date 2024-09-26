export type Hex = `0x${string}`;

export type Buildable = {
	build: () => Hex;
};
