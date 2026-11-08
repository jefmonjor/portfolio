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
    photographer: "Domaintechnik",
    profile: "https://unsplash.com/@fslfsl",
  },
  statement: {
    image: statementImage,
    photographer: "Ilya Pavlov",
    profile: "https://unsplash.com/@ilyapavlov",
  },
  closing: {
    image: closingImage,
    photographer: "Harshit Katiyar",
    profile: "https://unsplash.com/@harshitkatiyar",
  },
  advisory: {
    image: advisoryImage,
    photographer: "Beatriz Cattel",
    profile: "https://unsplash.com/@bicattel",
  },
  delivery: {
    image: deliveryImage,
    photographer: "Glen Carrie",
    profile: "https://unsplash.com/@glencarrie",
  },
  fractional: {
    image: fractionalImage,
    photographer: "Abu Saeid",
    profile: "https://unsplash.com/@abusaeid01",
  },
} satisfies Record<string, SitePhoto>

export const unsplashReferral = "utm_source=jefmonjor_dev&utm_medium=referral"
