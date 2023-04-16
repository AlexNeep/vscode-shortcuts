import { ReactNodeArray } from "react";
import reactStringReplace from "react-string-replace";
import { ScenarioDescription, SelectedKeyInformation } from "~/utils/types";
import ScenarioPromptToComplete from "../chat/ScenarioPromptToComplete";

type DescriptionProps = {
  sentence: ScenarioDescription;
  selectedKeyInformation: SelectedKeyInformation[];
};

export function Description({
  sentence,
  selectedKeyInformation,
}: DescriptionProps) {
  let replacedSentence: any = sentence;

  selectedKeyInformation.forEach(({ id, value }) => {
    replacedSentence = reactStringReplace(replacedSentence, `{{${id}}}`, () => (
      <ScenarioPromptToComplete key={id} value={value} />
    ));
  });

  return replacedSentence;
}
