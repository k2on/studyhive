"use client"

import { useParams } from "next/navigation";
import { api } from "~/trpc/react"
import { Props } from "./page";
import { RouterOutputs } from "~/trpc/shared";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useState } from "react";
import { v4 } from "uuid";
import { warn } from "console";
import { Answers } from "./answers";

export function Questions() {
    const { course, materials } = useParams<Props["params"]>();
    const { data } = api.question.getQuestions.useQuery({ id: materials });

    return <div className="flex flex-col space-y-4 py-4">
        {data?.map((question, idx) => <Question key={question.id} idx={idx} question={question} />)}
    </div>
}

interface QuestionProps {
    idx: number;
    question: RouterOutputs["question"]["getQuestions"][number]
}
function Question({ idx, question }: QuestionProps) {
    return <Card>
        <CardHeader>
            <CardTitle>Question {idx + 1}</CardTitle>
        </CardHeader>
        <CardContent>
            {question.content}
            <Answers questionID={question.id} />
        </CardContent>
    </Card>

}

export function AddQuestion() {
    const util = api.useUtils();
    const { materials } = useParams<Props["params"]>();

    const [content, setContent] = useState("");

    const { mutate } = api.question.create.useMutation({
        onSuccess(data, variables, context) {
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

    return <Card>
        <CardHeader>
            <CardTitle>New Question</CardTitle>
        </CardHeader>
        <CardContent>
            <Input placeholder="Add a question/topic to study" value={content} onChange={(e) => setContent(e.target.value)} />
            <br />
            <Button disabled={content.length == 0} onClick={onClick}>Post</Button>
        </CardContent>
    </Card>
}
