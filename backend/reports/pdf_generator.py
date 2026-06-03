from fpdf import FPDF
import os

class PDFReportGenerator:
    def __init__(self):
        self.output_dir = "reports_output"
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def generate_report(self, data):
        pdf = FPDF()
        pdf.add_page()
        
        # Title
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(200, 10, txt="ViralMind AI Report", ln=True, align='C')
        
        # Influencer Info
        pdf.set_font("Arial", 'B', 12)
        pdf.cell(200, 10, txt=f"Influencer: {data.get('username')}", ln=True)
        
        pdf.set_font("Arial", '', 11)
        pdf.cell(200, 8, txt=f"ViralMind Score: {data.get('viralmind_score')}", ln=True)
        pdf.cell(200, 8, txt=f"Followers: {data.get('followers')}", ln=True)
        pdf.cell(200, 8, txt=f"Engagement Rate: {data.get('engagement_rate')}%", ln=True)
        pdf.cell(200, 8, txt=f"Authenticity Score: {data.get('authenticity_score')}", ln=True)
        pdf.cell(200, 8, txt=f"Growth Score: {data.get('growth_score')}", ln=True)
        
        pdf.ln(5)
        pdf.set_font("Arial", 'B', 12)
        pdf.cell(200, 10, txt="AI Insights:", ln=True)
        pdf.set_font("Arial", '', 10)
        pdf.multi_cell(0, 5, txt=str(data.get('ai_insights', 'No insights available.')))
        
        file_path = os.path.join(self.output_dir, f"{data.get('username')}_report.pdf")
        pdf.output(file_path)
        
        return file_path

pdf_generator = PDFReportGenerator()
