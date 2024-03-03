"use client"

import { useParams } from "next/navigation";
import { api } from "~/trpc/react"
import { Props } from "./page";
import { RouterOutputs } from "~/trpc/shared";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useState } from "react";
import { v4 } from "uuid";
import { Answers } from "./answers";
import ReactQuill from "react-quill";
import parse, { HTMLReactParserOptions, attributesToProps } from "html-react-parser";


import "react-quill/dist/quill.snow.css";
import TimeAgo from "react-timeago";

export function Questions() {
    const { materials } = useParams<Props["params"]>();
    const { data } = api.question.getQuestions.useQuery({ id: materials }, { refetchInterval: 5000 });

    return <div className="flex flex-col space-y-4 py-4">
        {data?.map((question, idx) => <Question key={question.id} idx={idx} question={question} />)}
    </div>
}

const supportedTags = ['div', 'span', 'p', 'a', 'ul', 'li', 'img'];

const options: HTMLReactParserOptions = {
  replace: (node) => {
    if (node.type === 'tag' && !supportedTags.includes(node.name)) {
      const props = attributesToProps(node.attribs);
      console.log(node.children);
      return <span {...props} className="unsupported-tag">{node.children.map(c => (c as any).data)}</span>;
    }
  }
};

interface QuestionProps {
    idx: number;
    question: RouterOutputs["question"]["getQuestions"][number]
}
function Question({ idx, question }: QuestionProps) {
    return (
      <Card>
        <CardHeader className="py-4">
            <CardTitle>Question {idx + 1}</CardTitle>
            <CardDescription className="text-xs flex justify-between">
              <div className="text-gray-450">
                <img className="rounded-full h-4 inline-block" src={question.user.image ?? "/addclasses.webp"}/> {question.user.name}
              </div>
              <TimeAgo date={question.createdAt} className="text-gray-400 block justify-right text-gray-400 text-xs"/>
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4 border-b-4 pb-4 font-medium">
              {parse(question.content, options)}
            </div>
            <Answers questionID={question.id} />
        </CardContent>
    </Card>
  );
}

export function AddQuestion() {
    const util = api.useUtils();
    const { materials } = useParams<Props["params"]>();

    const [content, setContent] = useState("");

    const { mutate } = api.question.create.useMutation({
        onSuccess() {
            util.question.getQuestions.invalidate();
            setContent("");
        },
    });

    const onClick = () => {
        mutate({
            id: v4(),
            materialID: materials,
            content,
        })
    }

    return (
      <Card>
        <CardHeader>
            <CardTitle>New Question</CardTitle>
        </CardHeader>
        <CardContent>
            <ReactQuill theme="snow" placeholder="Write a question!" value={content} onChange={setContent}/>
            <br />
            <Button disabled={content.length == 0} onClick={onClick}>Post</Button>
        </CardContent>
      </Card>
    );
}
