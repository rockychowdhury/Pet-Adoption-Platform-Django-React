import os
from io import BytesIO
import datetime
from django.conf import settings
from django.core.files.base import ContentFile
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

def generate_adoption_agreement_pdf(application, legal_agreement):
    """
    Generate PDF for adoption agreement using ReportLab (Pure Python).
    Save it to the LegalAgreement model.
    """
    try:
        # Buffer for PDF
        result = BytesIO()
        
        # Document
        doc = SimpleDocTemplate(
            result,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72,
            title=f"Adoption Agreement - {application.pet.pet_name}"
        )
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            alignment=TA_CENTER,
            spaceAfter=30,
            textColor=colors.HexColor('#2c3e50')
        )
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Heading2'],
            spaceBefore=20,
            spaceAfter=10,
            textColor=colors.HexColor('#34495e')
        )
        body_style = styles['Normal']
        body_style.spaceAfter = 12
        
        story = []
        
        # Header
        story.append(Paragraph("Pet Adoption Agreement", title_style))
        story.append(Paragraph(f"Date: {datetime.date.today().strftime('%B %d, %Y')}", body_style))
        story.append(Spacer(1, 12))
        
        # Parties
        story.append(Paragraph(f"<b>Pet Owner (Rehomer):</b> {application.pet.pet_owner.first_name} {application.pet.pet_owner.last_name}", body_style))
        story.append(Paragraph(f"<b>Adopter:</b> {application.applicant.first_name} {application.applicant.last_name}", body_style))
        
        story.append(Spacer(1, 12))
        
        # 1. Pet Description
        story.append(Paragraph("1. Pet Description", subtitle_style))
        
        pet_data = [
            ['Name:', application.pet.pet_name],
            ['Species / Breed:', f"{application.pet.species} / {application.pet.breed}"],
            ['Age / Gender:', f"{application.pet.age_months // 12} years / {application.pet.gender}"],
            ['Microchip ID:', application.pet.medical_history.get('microchip_id', 'N/A') if application.pet.medical_history else 'N/A']
        ]
        
        t = Table(pet_data, colWidths=[120, 300])
        t.setStyle(TableStyle([
            ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
            ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t)
        
        # 2. Terms
        story.append(Paragraph("2. Terms of Adoption", subtitle_style))
        
        terms = [
            "1. Care: To provide fresh water, quality food, shelter, and medical care.",
            "2. Safety: To keep the pet safe and comply with animal control laws.",
            "3. No Transfer: To not sell, give away, or abandon the pet. Contact Rehomer if necessary.",
            "4. Updates: To allow reasonable check-ins for the first 6 months."
        ]
        
        for term in terms:
            story.append(Paragraph(term, body_style))
            
        # 3. Waiver
        story.append(Paragraph("3. Waiver of Liability", subtitle_style))
        story.append(Paragraph("The Adopter releases the Rehomer and PetCircle from any liability regarding the pet's health or behavior after today.", body_style))
        
        story.append(Spacer(1, 30))
        
        # 4. Signatures
        story.append(Paragraph("4. Digital Signatures", subtitle_style))
        story.append(Paragraph("By signing digitally, both parties agree to these terms.", body_style))
        
        story.append(Spacer(1, 20))
        
        # Signature Table
        sig_data = [
            ['Pet Owner Signature', 'Adopter Signature'],
            ['', ''],
            [f"Date: {datetime.date.today()}", f"Date: {datetime.date.today()}"],
            [f"IP: {legal_agreement.pet_owner_ip or 'Pending'}", f"IP: {legal_agreement.adopter_ip or 'Pending'}"]
        ]
        
        sig_table = Table(sig_data, colWidths=[230, 230])
        sig_table.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('LINEABOVE', (0,1), (-1,1), 1, colors.black),
            ('TOPPADDING', (0,2), (-1,2), 5),
        ]))
        story.append(sig_table)
        
        # Footer
        story.append(Spacer(1, 30))
        story.append(Paragraph(f"<font size=8 color='grey'>Generated by PetCircle Platform | Agreement ID: {legal_agreement.id}</font>", ParagraphStyle('Footer', parent=body_style, alignment=TA_CENTER)))

        # Build
        doc.build(story)
        
        # Save to model
        filename = f"agreement_{application.id}.pdf"
        legal_agreement.document_url.save(filename, ContentFile(result.getvalue()))
        
        # Save text snapshot
        legal_agreement.terms_text = "Standard PetCircle Adoption Agreement v1.0\n\n" + "\n".join(terms)
        legal_agreement.save()
        
        return True
        
    except Exception as e:
        print(f"PDF Generation Error: {e}")
        return False
