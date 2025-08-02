# ProsConsAI

A smart pros and cons list application with AI-powered decision analysis using OpenAI.

## Features

- ✅ Create and manage multiple pros and cons lists
- ✅ Add, edit, and delete pros and cons items
- ✅ Persistent local storage
- 🤖 **NEW: AI-powered decision analysis** - Get intelligent recommendations based on your pros and cons
- 📱 Responsive design with modern UI
- 🎨 Beautiful card-based interface

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd prosconsai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure OpenAI API Key**
   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## AI Analysis Feature

The AI Analysis feature uses OpenAI's GPT-4o-mini model to provide intelligent decision recommendations based on your pros and cons lists. 

### How it works:
1. Add pros and cons to your list
2. Click "Analyze Decision" in the AI Analysis card
3. Get a recommendation with:
   - **Decision recommendation** (Proceed/Avoid/Consider Carefully)
   - **Confidence level** (0-100%)
   - **Detailed reasoning**
   - **Key factors** that influenced the analysis
   - **Additional considerations** to think about

### Requirements:
- Valid OpenAI API key
- At least one pro or con item in your list

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: Tailwind CSS + Radix UI components
- **State Management**: Zustand with persistence
- **AI**: OpenAI GPT-4o-mini
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for AI analysis | Yes (for AI features) |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/
│   ├── api/analyze/          # AI analysis API endpoint
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── AIAnalysisCard.tsx    # AI analysis interface
│   ├── ProConListView.tsx    # Main list view
│   └── ...                   # Other components
├── lib/
│   ├── openai.ts            # OpenAI service
│   └── utils.ts             # Utility functions
├── store/
│   └── procon.ts            # Zustand store
├── types/
│   └── index.ts             # TypeScript types
└── utils/
    └── storage.ts           # Storage utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
