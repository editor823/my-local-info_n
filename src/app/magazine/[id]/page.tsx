import BenefitDetailPage, {
  generateMetadata as benefitGenerateMetadata,
  generateStaticParams as benefitGenerateStaticParams,
} from "../../benefit/[id]/page";

export const generateMetadata = benefitGenerateMetadata;
export const generateStaticParams = benefitGenerateStaticParams;
export default BenefitDetailPage;
