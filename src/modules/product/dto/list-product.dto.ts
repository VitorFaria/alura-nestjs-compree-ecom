class ListProductFeaturesDTO {
  name: string;
  description: string;
}

class ListProductImagesDTO {
  url: string;
  description: string;
}

export class ListProductDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly amountAvailable: number,
    readonly features: ListProductFeaturesDTO[],
    readonly images: ListProductImagesDTO[],
  ) {}
}
