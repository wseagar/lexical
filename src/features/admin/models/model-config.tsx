"use client";
import { useForm, useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import OpenAI from "openai";
import { useEffect, useState } from "react";
import { useGlobalMessageContext } from "@/features/global-message/global-message-context";
import { Loader } from "lucide-react";

const MODEL_PROVIDERS = [
  {
    name: "OpenAI",
    value: "openai",
    models: [
      {
        name: "GPT-3.5",
        value: "gpt3.5",
      },
      {
        name: "GPT-4",
        value: "gpt4",
      },
    ],
  },
  {
    name: "Anthropic",
    value: "anthropic",
    models: [
      {
        name: "Claude Instant",
        value: "claude-instant",
      },
      {
        name: "Claude 2.1",
        value: "claude-2.1",
      },
    ],
  },
];

function OpenAIConfig() {
  const form = useFormContext();
  const provider = form.watch("provider");
  if (provider !== "openai") return <></>;
  return (
    <div className="space-y-2">
      {/* put api key into config.apiKey */}
      <FormField
        control={form.control}
        name="openai.apiKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Key</FormLabel>
            <br></br>
            <input
              {...field}
              id="openai.apiKey"
              className="border rounded p-2 w-full"
              required
              placeholder="Enter your API key"
            />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="openai.model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_PROVIDERS.find((p) => p.value === "openai")!.models.map(
                  (model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}

function AnthropicConfig() {
  const form = useFormContext();
  const provider = form.watch("provider");
  if (provider !== "anthropic") return <></>;
  return (
    <div className="space-y-2">
      {/* put api key into config.apiKey */}
      <FormField
        control={form.control}
        name="anthropic.apiKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Key</FormLabel>
            <br></br>
            <input
              {...field}
              id="anthropic.apiKey"
              className="border rounded p-2 w-full"
              required
              placeholder="Enter your API key"
            />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="anthropic.model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_PROVIDERS.find(
                  (p) => p.value === "anthropic"
                )!.models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}

type ModelConfig = {
  provider: string;
  openai: {
    apiKey: string;
    model: string;
  };
  anthropic: {
    apiKey: string;
    model: string;
  };
};

function defaultConfig() {
  return {
    provider: "",
    openai: {
      apiKey: "",
      model: "",
    },
    anthropic: {
      apiKey: "",
      model: "",
    },
  };
}

export default function ModelConfig({ config }: { config?: ModelConfig }) {
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useGlobalMessageContext();
  const defaultValues = config || defaultConfig();
  const form = useForm({
    defaultValues: defaultValues,
  });
  const provider = form.watch("provider");

  async function onSubmit(values: ModelConfig) {
    try {
      setLoading(true);
      const response = await fetch("/api/config", {
        method: "POST",
        body: JSON.stringify({
          key: "llm",
          value: values,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save config");
      }
      showSuccess({
        title: "Model Configuration",
        description: "Model configuration saved successfully.",
      });
    } catch (error) {
      showError("" + error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-3xl mb-6">Model Configuration</div>
        <div className="flex flex-col space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {MODEL_PROVIDERS.map((provider) => (
                          <SelectItem
                            key={provider.value}
                            value={provider.value}
                          >
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <OpenAIConfig />
              <AnthropicConfig />
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !provider}
              >
                {loading ? (
                  <Loader className="animate-spin" size={16} />
                ) : (
                  "Save Configuration"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
