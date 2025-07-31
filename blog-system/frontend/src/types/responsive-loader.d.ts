declare module "responsive-loader" {
  import { LoaderDefinition } from "webpack";
  const loader: LoaderDefinition;
  export default loader;
}

declare module "responsive-loader/sharp" {
  import { Sharp } from "sharp";

  interface SharpAdapter {
    (
      input: Buffer | string,
      options: {
        quality?: number;
        format?: string;
        [key: string]: unknown;
      }
    ): Promise<Sharp>;
  }

  const adapter: SharpAdapter;
  export default adapter;
}
