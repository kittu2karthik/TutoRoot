const { createObjectCsvStringifier } = require('csv-writer');
const { Upload, QaPair } = require('../models');

exports.getUserUploads = async (req, res) => {
  try {
    const uploads = await Upload.findAll({
      where: { user_id: req.user.id },
      attributes: [
        'id',
        'question_pdf_filename',
        'answer_pdf_filename',
        'created_at',
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(uploads);
  } catch (error) {
    console.error('Failed to fetch uploads', error);
    res.status(500).json({ error: 'Failed to fetch uploads' });
  }
};

exports.getUploadPairs = async (req, res) => {
  try {
    const uploadId = req.params.id;
    // Verify ownership
    const uploadCheck = await Upload.findOne({
      where: { id: uploadId, user_id: req.user.id },
    });
    if (!uploadCheck)
      return res
        .status(404)
        .json({ error: 'Upload not found or unauthorized' });

    const pairs = await QaPair.findAll({
      where: { upload_id: uploadId },
      order: [['id', 'ASC']],
    });
    res.json(pairs);
  } catch (error) {
    console.error('Failed to fetch pairs', error);
    res.status(500).json({ error: 'Failed to fetch pairs' });
  }
};

exports.updatePair = async (req, res) => {
  try {
    const pairId = req.params.id;
    const { question, answer } = req.body;

    // Verify ownership by finding pair and including upload
    const pair = await QaPair.findOne({
      where: { id: pairId },
      include: [
        {
          model: Upload,
          where: { user_id: req.user.id },
          required: true,
        },
      ],
    });

    if (!pair)
      return res.status(404).json({ error: 'Pair not found or unauthorized' });

    pair.question = question;
    pair.answer = answer;
    pair.is_edited = true;
    await pair.save();

    res.json(pair);
  } catch (error) {
    console.error('Failed to update pair', error);
    res.status(500).json({ error: 'Failed to update pair' });
  }
};

exports.exportCsv = async (req, res) => {
  try {
    const uploadId = req.params.id;
    const uploadCheck = await Upload.findOne({
      where: { id: uploadId, user_id: req.user.id },
    });
    if (!uploadCheck) return res.status(404).json({ error: 'Unauthorized' });

    const pairs = await QaPair.findAll({
      where: { upload_id: uploadId },
      attributes: ['question', 'answer'],
      order: [['id', 'ASC']],
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'question', title: 'Question' },
        { id: 'answer', title: 'Answer' },
      ],
    });

    const formattedPairs = pairs.map((p) => ({
      question: p.question,
      answer: p.answer,
    }));
    const csvStr =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(formattedPairs);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="upload_${uploadId}_pairs.csv"`
    );
    res.send(csvStr);
  } catch (error) {
    console.error('Export CSV failed', error);
    res.status(500).json({ error: 'Export failed' });
  }
};

exports.exportHtml = async (req, res) => {
  try {
    const uploadId = req.params.id;
    const uploadCheck = await Upload.findOne({
      where: { id: uploadId, user_id: req.user.id },
    });
    if (!uploadCheck) return res.status(404).json({ error: 'Unauthorized' });

    const pairs = await QaPair.findAll({
      where: { upload_id: uploadId },
      attributes: ['question', 'answer'],
      order: [['id', 'ASC']],
    });

    let rowsHtml = pairs
      .map(
        (p) => `
      <tr class="transition-colors hover:bg-white/5">
        <td class="px-6 py-4 align-top whitespace-pre-wrap text-white/80 border-b border-white/5">${
          p.question
        }</td>
        <td class="px-6 py-4 align-top whitespace-pre-wrap text-white/80 border-b border-white/5">${
          p.answer ||
          '<span class="text-red-400 font-medium italic">No answer matched</span>'
        }</td>
      </tr>
    `
      )
      .join('');

    const htmlStr = `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TutoRoot Extractor - Q&A Pairs Export</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Premium Dark Theme Variables */
    :root {
      --background: 230 25% 6%;
      --foreground: 210 40% 98%;
      --card: 230 25% 10% / 0.4;
      --card-foreground: 210 40% 98%;
      --radius: 0.75rem;
    }
    
    body {
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
      margin: 0;
    }

    /* Animated Glowing Orbs Background */
    body::before,
    body::after {
      content: "";
      position: fixed;
      width: 60vw;
      height: 60vw;
      border-radius: 50%;
      filter: blur(120px);
      z-index: -1;
      opacity: 0.35;
      animation: float 25s infinite ease-in-out alternate;
      pointer-events: none;
    }

    body::before {
      background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(0, 0, 0, 0) 70%); /* Violet */
      top: -10%;
      left: -10%;
      animation-delay: -5s;
    }

    body::after {
      background: radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(0, 0, 0, 0) 70%); /* Sky Blue */
      bottom: -10%;
      right: -10%;
    }

    @keyframes float {
      0% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(10%, 10%) scale(1.1); }
      66% { transform: translate(-10%, 5%) scale(0.9); }
      100% { transform: translate(5%, -10%) scale(1); }
    }

    /* Global Glassmorphism */
    .glass-card {
      background-color: hsl(var(--card));
      color: hsl(var(--card-foreground));
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: var(--radius);
    }
  </style>
</head>
<body class="p-4 sm:p-8">
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-white/90">Extracted Results</h1>
      <p class="text-white/50 mt-2">Exported Q&A Pairs from TutoRoot</p>
    </div>
    
    <div class="glass-card overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead>
          <tr>
            <th class="px-6 py-4 font-medium text-white/50 border-b border-white/10 uppercase tracking-wider text-xs">Question</th>
            <th class="px-6 py-4 font-medium text-white/50 border-b border-white/10 uppercase tracking-wider text-xs">Answer</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="upload_${uploadId}_pairs.html"`
    );
    res.send(htmlStr);
  } catch (error) {
    console.error('Export HTML failed', error);
    res.status(500).json({ error: 'Export failed' });
  }
};
