const PDFParser = require('pdf2json');
const { Upload, QaPair } = require('../models');

function parseQuestions(text) {
  const pairs = [];
  const qRegex =
    /(?:Q|Question\s*)(\d+)[\.\:]\s*([\s\S]*?)(?=(?:Q|Question\s*)\d+[\.\:]|$)/gi;
  let match;
  while ((match = qRegex.exec(text)) !== null) {
    pairs.push({ num: match[1], text: match[2].trim() });
  }
  return pairs;
}

function parseAnswers(text) {
  const map = new Map();
  const aRegex =
    /(?:Ans|Answer\s*)(\d+)[\.\:]\s*([\s\S]*?)(?=(?:Ans|Answer\s*)\d+[\.\:]|$)/gi;
  let match;
  while ((match = aRegex.exec(text)) !== null) {
    map.set(match[1], match[2].trim());
  }
  return map;
}

function extractTextFromPDF(pdfPath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1);
    pdfParser.on('pdfParser_dataError', (errData) =>
      reject(errData.parserError)
    );
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.loadPDF(pdfPath);
  });
}

exports.uploadPdfs = async (req, res) => {
  try {
    const files = req.files;
    if (!files || !files.questionPdf || !files.answerPdf) {
      return res
        .status(400)
        .json({ error: 'Both question and answer PDFs are required.' });
    }

    const qPath = files.questionPdf[0].path;
    const aPath = files.answerPdf[0].path;

    // Extract text using pdf2json
    let qText = await extractTextFromPDF(qPath);
    let aText = await extractTextFromPDF(aPath);

    // Normalize text: remove pdf2json page breaks and carriage returns
    qText = qText
      .replace(/----------------Page \(\d+\) Break----------------/gi, '\n')
      .replace(/\r/g, '');
    aText = aText
      .replace(/----------------Page \(\d+\) Break----------------/gi, '\n')
      .replace(/\r/g, '');

    // Parse text
    const questions = parseQuestions(qText);
    const answersMap = parseAnswers(aText);

    // Create DB upload record using Sequelize
    const upload = await Upload.create({
      user_id: req.user.id,
      question_pdf_filename: files.questionPdf[0].filename,
      answer_pdf_filename: files.answerPdf[0].filename,
    });

    // Generate Q&A pairs
    const pairs = questions.map((q) => {
      const answer = answersMap.get(q.num) || '';
      return {
        upload_id: upload.id,
        question: `Q${q.num}. ${q.text}`,
        answer,
      };
    });

    // Insert pairs using bulkCreate
    if (pairs.length > 0) {
      await QaPair.bulkCreate(pairs);
    }

    res.json({
      message: 'Files processed successfully',
      uploadId: upload.id,
      parsedCount: pairs.length,
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Failed to process PDFs' });
  }
};
