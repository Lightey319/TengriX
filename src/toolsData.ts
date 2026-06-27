import { AITool } from "./types";

export const MONGOLIAN_TOOLS: AITool[] = [
  {
    id: "traditional-script",
    nameMN: "Монгол бичгийн тайлбарлагч",
    nameEN: "Traditional Script Explainer",
    descriptionMN: "Кирилл үгийг монгол бичгийн галиг, бичих дүрэм болон түүхэн утгыг тайлбарлана.",
    descriptionEN: "Get Traditional Mongolian script transliterations, spelling instructions, and historical context.",
    icon: "FileText",
    promptPlaceholderMN: "Монгол бичгээр тайлбарлуулах кирилл үгээ оруулна уу (жишээ нь: Тэнгэр, Монгол, Эрдэм)...",
    promptPlaceholderEN: "Enter a Cyrillic Mongolian word to get its traditional script guidelines (e.g. Tenger, Mongol, Erdem)...",
    systemInstruction: `The user wants to understand how a Cyrillic Mongolian word is written and spelled in the Traditional Mongolian Script (Монгол бичиг).
For the word entered by the user:
1. Provide its Traditional Mongolian script spelling / transcription (using vertical script Unicode representation if possible, otherwise romanized transcriptions and clear spelling guidelines, e.g. "m-o-ng-g-o-l" for Монгол, "t-e-ng-g-e-r" for Тэнгэр).
2. Explain the spellings, roots, and vowel harmony rules (эрэгтэй, эмэгтэй, саармаг эгшиг).
3. Provide the historical/etymological meaning of the word if any.
Provide the entire explanation in a beautifully structured format, using Mongolian by default (unless they ask in English). Use headers, lists, and bullet points.`
  },
  {
    id: "spell-checker",
    nameMN: "Зөв бичих дүрэм ба Хяналт",
    nameEN: "Spell Checker & Grammar",
    descriptionMN: "Өгүүлбэрийн зөв бичих дүрмийн алдааг шалгаж, Ц.Дамдинсүрэнгийн дүрмийн дагуу зөвлөгөө өгнө.",
    descriptionEN: "Check your Mongolian writing for grammatical errors and get rule-based corrections.",
    icon: "CheckSquare",
    promptPlaceholderMN: "Шалгуулах өгүүлбэр эсвэл эхээ энд бичнэ үү...",
    promptPlaceholderEN: "Type your Mongolian text here to check spelling and grammar...",
    systemInstruction: `The user is seeking spelling and grammatical corrections for Mongolian text (using Cyrillic Mongolian / Монгол хэл).
Analyze the input text:
1. Correct all spelling, punctuation, and grammatical mistakes in accordance with the official rules established by Damdinsuren (Ц.Дамдинсүрэнгийн зөв бичих дүрэм).
2. Present a clear side-by-side or line-by-line comparison of:
   - "Алдаатай эх" (Original Text)
   - "Зассан эх" (Corrected Text)
3. List the rules violated (such as эгшиг гээгдэх хууль, залгах нөхцөлийн дүрэм) and explain the correct rules in a simple, friendly, educational manner.`
  },
  {
    id: "proverbs-explainer",
    nameMN: "Зүйр цэцэн үгийн тайлал",
    nameEN: "Proverb & Wisdom Explainer",
    descriptionMN: "Ардын уламжлалт зүйр цэцэн үг, сургаалын гүн гүнзгий утга учир, сургамжийг тайлбарлана.",
    descriptionEN: "Unveil the deep philosophy, history, and life lessons behind Mongolian traditional proverbs.",
    icon: "Compass",
    promptPlaceholderMN: "Тайлбарлуулах зүйр цэцэн үгээ бичнэ үү (эсвэл 'Санамсаргүй үг' гэж бичвэл бид сонгоно)...",
    promptPlaceholderEN: "Enter a Mongolian proverb or type 'Random' to get one with explanation...",
    systemInstruction: `The user is asking for the explanation, philosophy, and context of a traditional Mongolian proverb (Зүйр цэцэн үг).
If the user inputs "Random" or "Санамсаргүй үг" or leaves it general, pick a beautiful traditional Mongolian proverb first.
Then:
1. State the proverb clearly.
2. Explain its literal meaning in everyday modern Mongolian.
3. Dive into its philosophical, social, or moral significance.
4. Provide an equivalent or similar concept in English/Western culture to make it globally understandable.
Write in an elegant, inspiring, and cultural tone.`
  },
  {
    id: "culture-guide",
    nameMN: "Өв соёл, зан заншил",
    nameEN: "Nomadic Culture & Traditions",
    descriptionMN: "Монголын түүх, нүүдэлчин ахуй, гэр, наадам, цагаан сарын уламжлалын талаар лавлах.",
    descriptionEN: "Learn about Mongolian history, nomadic lifestyle, ger layout rules, festivals, and customs.",
    icon: "Globe",
    promptPlaceholderMN: "Монгол өв соёлтой холбоотой мэдэхийг хүссэн зүйлээ асууна уу...",
    promptPlaceholderEN: "Ask anything about Mongolian history, ger etiquette, nomadic culture, or festivals...",
    systemInstruction: `You are an expert on Mongolian History, Nomadic Heritage, and Traditional Etiquette.
The user wants to learn about specific Mongolian customs, historical events, nomadic structures (like the Ger layout, toono, bagana, and direction rules), or annual celebrations (Tsagaan Sar, Naadam).
Provide rich, engaging, culturally accurate, and deeply respectful answers.
Use lists to outline strict protocols (e.g., Ger etiquette: do not step on the threshold - босго бүү алх, do not walk between columns, etc.).
Keep the atmosphere warm and proud of nomadic civilizations.`
  },
  {
    id: "cultural-translator",
    nameMN: "Ухаалаг орчуулагч",
    nameEN: "Context-Aware Translator",
    descriptionMN: "Монгол болон бусад хэлний хооронд хэлц үг, зан заншлын контекстийг хадгалан ухаалгаар хөрвүүлнэ.",
    descriptionEN: "Translate text between Mongolian and other languages, retaining idioms, politeness, and context.",
    icon: "Languages",
    promptPlaceholderMN: "Орчуулах, тайлбарлуулах текстээ оруулаад орчуулах хэлээ заана уу (жишээ нь: англи руу)...",
    promptPlaceholderEN: "Enter text to translate and specify the target language...",
    systemInstruction: `You are a high-level contextual translator specializing in translating to and from Mongolian.
When translating:
1. Provide the direct translation.
2. Identify and translate any idioms, unique phrases, or cultural references (e.g. "сэтгэл цагаан", "гар сунгах", "хийморь") that cannot be translated literally.
3. Suggest alternative phrasing depending on formality or context (Хүндэтгэлийн болон энгийн хэллэг).
4. List vocabulary highlights.`
  }
];
