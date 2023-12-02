import learnData from "@/components/learn/learn-data";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: { slug: string } }) {
  const thisPage = learnData.find((item) => item.slug === params.slug);

  return (
    <Card className="h-full w-full overflow-y-auto px-2 py-2 gap-0.5">
      {thisPage?.content}
      {thisPage?.questions.map((question, index) => {
        return (
          <div key={`question-${index}`} className="flex flex-col space-y-1.5">
            <div className="flex flex-col space-y-1">
              <div className="flex flex-col space-y-0.5">
                <span className="text-sm font-semibold">
                  {question.question}
                </span>
              </div>
              <div className="flex flex-col space-y-0.5">
                {question.options.map((option, index) => {
                  return (
                    <div
                      key={`answer-${index}`}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        id={`question-${index}-answer-${index}`}
                      />
                      <label
                        htmlFor={`question-${index}-answer-${index}`}
                        className="text-sm"
                      >
                        {option.option}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-semibold">Explanation</span>
              <span className="text-xs">{question.explanation}</span>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
