import BenefitDetailPage, {
  generateMetadata as benefitGenerateMetadata,
  generateStaticParams as benefitGenerateStaticParams,
} from "../../benefit/[id]/page";
import type { Metadata } from "next";

export async function generateMetadata(props: any): Promise<Metadata> {
  const meta = await benefitGenerateMetadata(props);
  return {
    ...meta,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export const generateStaticParams = benefitGenerateStaticParams;
export default BenefitDetailPage;
