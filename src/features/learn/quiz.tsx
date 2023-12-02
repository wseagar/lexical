"use client";
import learnData from "@/components/learn/learn-data";
import { useState } from "react";

interface QuestionState {
  currentOption: number | null;
  isCorrect: boolean | null;
}

export default function Home(props: any) {
  const thisPage = learnData.find((item) => item.slug === props.slug ?? "");

  const [quizState, setQuizState] = useState<QuestionState[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<number>(-1);

  const updateQuizState = (
    index: number,
    answer: number,
    isCorrect: boolean
  ) => {
    const newQuizState = [...quizState];
    newQuizState[index] = {
      currentOption: answer,
      isCorrect,
    };
    setQuizState(newQuizState);
  };

  const optionClass = (questionIndex: number, optionIndex: number) => {
    if (quizState[questionIndex]?.currentOption === optionIndex) {
      if (quizState[questionIndex]?.isCorrect) {
        return "bg-green-200";
      } else {
        return "bg-red-200";
      }
    }
    return "";
  };

  return (
    <>
      {thisPage?.content}

      <div>
        {activeQuestion === -1 && (
          <>
            <div onClick={() => setActiveQuestion(0)}>Start Quiz</div>
          </>
        )}

        {activeQuestion > -1 && (
          <>
            {thisPage?.questions.map((question, questionIndex) => {
              const thisQuestion = quizState[questionIndex];
              return (
                <div
                  key={`question-${questionIndex}`}
                  className="flex flex-col space-y-1.5"
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-sm font-semibold">
                        {question.question}
                      </span>
                    </div>
                    <div>
                      {question.options.map((option, index) => {
                        return (
                          <div
                            key={`option-${index}`}
                            className={optionClass(questionIndex, index)}
                            onClick={() => {
                              updateQuizState(
                                questionIndex,
                                index,
                                option.correct
                              );
                            }}
                          >
                            {option.option}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col space-y-0.5"></div>
                  </div>
                  {thisQuestion && (
                    <div className="flex flex-col space-y-1">
                      {thisQuestion.isCorrect && (
                        <span className="text-xs">Correct!</span>
                      )}
                      <span className="text-xs">{question.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      <pre>{JSON.stringify(quizState, null, 2)}</pre>
    </>
  );
}
