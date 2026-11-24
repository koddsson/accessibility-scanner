const frames: HTMLIFrameElement[] = [];

export async function render(
  source: string,
  mimeType: DOMParserSupportedType,
): Promise<Document> {
  if (mimeType !== "text/html") {
    return new DOMParser().parseFromString(source, mimeType);
  }

  const frame = document.createElement("iframe");
  frame.width = "1024";
  frame.height = "768";
  const loaded = new Promise((resolve) => {
    frame.addEventListener("load", resolve, { once: true });
  });
  frame.srcdoc = source;
  document.body.append(frame);
  frames.push(frame);
  await loaded;
  return frame.contentDocument!;
}

export function cleanup(): void {
  for (const frame of frames.splice(0)) frame.remove();
}
