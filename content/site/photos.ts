import type { StaticImageData } from "next/image"

import heroImage from "@/public/images/site/hero.jpg"
import statementImage from "@/public/images/site/statement.jpg"
import closingImage from "@/public/images/site/closing.jpg"
import advisoryImage from "@/public/images/site/advisory.jpg"
import deliveryImage from "@/public/images/site/delivery.jpg"
import fractionalImage from "@/public/images/site/fractional.jpg"

export type SitePhoto = {
  image: StaticImageData
  photographer: string
  profile: string
}

export const sitePhotos = {
  hero: {
    image: heroImage,
    photographer: "Mike Hindle",
    profile: "https://unsplash.com/@mikehindle",
  },
  statement: {
    image: statementImage,
    photographer: "Clarisse Croset",
    profile: "https://unsplash.com/@herfrenchness",
  },
  closing: {
    image: closingImage,
    photographer: "Alain Pham",
    profile: "https://unsplash.com/@alain_pham",
  },
  advisory: {
    image: advisoryImage,
    photographer: "Dorsa Masghati",
    profile: "https://unsplash.com/@dorsamasghati",
  },
  delivery: {
    image: deliveryImage,
    photographer: "Luca Upper",
    profile: "https://unsplash.com/@lucaupper",
  },
  fractional: {
    image: fractionalImage,
    photographer: "Ian Mustafa",
    profile: "https://unsplash.com/@ianmustafa",
  },
} satisfies Record<string, SitePhoto>

export const unsplashReferral = "utm_source=jefmonjor_dev&utm_medium=referral"
