import { AiToolPageGate } from "@/components/ai/AiToolPageGate"
import { getAiToolById } from "@/data/ai/tools"
import { AI_DISABLED_METADATA, buildAiToolMetadata } from "@/lib/ai/metadata"
import { AI_FEATURES_ENABLED } from "@/lib/features"

const TOOL_ID = "notice-generator"

export function generateMetadata() {
  if (!AI_FEATURES_ENABLED) return AI_DISABLED_METADATA
  const tool = getAiToolById(TOOL_ID)
  if (!tool) return {}
  return buildAiToolMetadata(tool)
}

export default function NoticeGeneratorPage() {
  return <AiToolPageGate toolId={TOOL_ID} />
}
