from django import forms
from .models import ProjectCall, ProjectSubmission, Competition, ProjectSubmissionReview

class ProjectCallForm(forms.ModelForm):
    class Meta:
        model = ProjectCall
        fields = ['title', 'description', 'start_date', 'end_date', 'budget', 'requirements', 'status']
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
        }

class ProjectSubmissionForm(forms.ModelForm):
    class Meta:
        model = ProjectSubmission
        fields = ['proposal', 'budget_proposal', 'project']
        widgets = {
            'proposal': forms.Textarea(attrs={'rows': 6}),
        }

class CompetitionForm(forms.ModelForm):
    class Meta:
        model = Competition
        fields = ['title', 'description', 'start_date', 'end_date', 'prize', 'max_participants']
        widgets = {
            'start_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'end_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'description': forms.Textarea(attrs={'rows': 6}),
            'prize': forms.Textarea(attrs={'rows': 4}),
        }

class ProjectSubmissionReviewForm(forms.ModelForm):
    class Meta:
        model = ProjectSubmissionReview
        fields = ['innovation_score', 'feasibility_score', 'market_potential_score', 'team_score', 'comments']
        widgets = {
            'comments': forms.Textarea(attrs={'rows': 4}),
        }
        help_texts = {
            'innovation_score': "Évaluez le niveau d'innovation du projet (1-5)",
            'feasibility_score': "Évaluez la faisabilité technique et financière du projet (1-5)",
            'market_potential_score': "Évaluez le potentiel commercial du projet (1-5)",
            'team_score': "Évaluez la capacité de l'équipe à réaliser le projet (1-5)",
        }
