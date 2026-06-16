import { notFound } from "next/navigation"

import { AiDisabledPage } from "@/components/ai/AiDisabledPage"
import { AiToolPage } from "@/components/ai/AiToolPage"
import { getAiToolById } from "@/data/ai/tools"
import { AI_FEATURES_ENABLED } from "@/lib/features"

interface AiToolPageGateProps {
  toolId: string
}

export function AiToolPageGate({ toolId }: AiToolPageGateProps) {
  const tool = getAiToolById(toolId)

  if (!tool) {
    notFound()
  }

  if (!AI_FEATURES_ENABLED) {
    return <AiDisabledPage title={tool.title} description={tool.description} />
  }

  return <AiToolPage tool={tool} />
}
