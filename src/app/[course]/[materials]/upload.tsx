"use client"

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { saveDocumentInteraction } from "./action";
import { createReadStream } from "fs";
import { useParams } from "next/navigation";
import { Props } from "./page";
import { api } from "~/trpc/react";

export function Upload() {
    const { materials } = useParams<Props["params"]>();
    const [isLoading, setIsLoading] = useState(false);

    const util = api.useUtils();

      const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
          return;
        }

        const file = files[0]!;
        const formData = new FormData();
        formData.append('file', file);

        setIsLoading(true);

          saveDocumentInteraction(materials, formData).then(() => {
              setIsLoading(false);
              util.question.getQuestions.invalidate();
          });

      }


    return <Card className="bg-purple-200">
        <CardHeader>
            <CardTitle>🧠 Upload a Study Guide</CardTitle>
        </CardHeader>
        <CardContent>
            <Input capture disabled={isLoading} onChange={handleFileChange} type="file" />
            {isLoading && <>
                <img src="https://media1.tenor.com/m/MFE6UiMEpRoAAAAC/math-zack-galifianakis.gif" />
                <h1 className="text-3xl text-center mt-4">Analyzing Document...</h1>
            </>}
        </CardContent>
    </Card>
}
