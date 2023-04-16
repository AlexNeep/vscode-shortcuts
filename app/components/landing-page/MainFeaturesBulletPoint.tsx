import { AiOutlineEdit, AiOutlineShop } from "react-icons/ai";
import { BsBarChartFill, BsTranslate } from "react-icons/bs";
import { IoReader } from "react-icons/io5";
import { MdQuiz } from "react-icons/md";
import { TbSpeakerphone } from "react-icons/tb";
import FeatureBulletPoint from "./FeatureBulletPoint";

const MainFeatureBulletPoints = () => {
  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 text-left sm:grid-cols-2 md:gap-12 xl:gap-16">
      <FeatureBulletPoint
        Icon={BsTranslate}
        title="Translate sentences instantly"
        paragraph="Translation any message into your native language"
      />

      <FeatureBulletPoint
        Icon={AiOutlineEdit}
        title="Improve your grammar"
        paragraph="Generate corrections & improve your your understanding of your target language"
      />

      <FeatureBulletPoint
        Icon={TbSpeakerphone}
        hideFill
        title="Speak in your target language"
        paragraph="Use advanced speech recognition AI to speak in your target language"
      />

      <FeatureBulletPoint
        Icon={BsBarChartFill}
        title="Grow your vocabulary"
        paragraph="Practise conversations with LanguageMate in an anxiety-free
        environment"
      />

      <FeatureBulletPoint
        Icon={AiOutlineShop}
        title="Real World Immersion"
        paragraph="Experience life as it happens through scenarios"
      />
    </div>
  );
};

export default MainFeatureBulletPoints;
