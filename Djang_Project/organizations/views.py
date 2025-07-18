from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from .models import ProjectCall, ProjectSubmission, Competition, CompetitionRegistration, ProjectSubmissionReview
from startups.models import Startup
from .forms import ProjectCallForm, ProjectSubmissionForm, CompetitionForm, ProjectSubmissionReviewForm
from .models import OrganizationMetrics

# Project Call Views
@login_required
def project_call_list(request):
    project_calls = ProjectCall.objects.all().order_by('-created_at')
    return render(request, 'organizations/project_call_list.html', {'project_calls': project_calls})

@login_required
def project_call_detail(request, pk):
    project_call = get_object_or_404(ProjectCall, pk=pk)
    submissions = project_call.submissions.all()
    return render(request, 'organizations/project_call_detail.html', {
        'project_call': project_call,
        'submissions': submissions
    })

@login_required
def project_call_create(request):
    if request.method == 'POST':
        form = ProjectCallForm(request.POST)
        if form.is_valid():
            project_call = form.save(commit=False)
            project_call.organization = request.user
            project_call.save()
            messages.success(request, 'Appel à projet créé avec succès.')
            return redirect('project_call_detail', pk=project_call.pk)
    else:
        form = ProjectCallForm()
    return render(request, 'organizations/project_call_form.html', {'form': form})

@login_required
def project_call_update(request, pk):
    project_call = get_object_or_404(ProjectCall, pk=pk)
    if request.method == 'POST':
        form = ProjectCallForm(request.POST, instance=project_call)
        if form.is_valid():
            form.save()
            messages.success(request, 'Appel à projet mis à jour avec succès.')
            return redirect('project_call_detail', pk=project_call.pk)
    else:
        form = ProjectCallForm(instance=project_call)
    return render(request, 'organizations/project_call_form.html', {'form': form, 'editing': True})

# Project Submission Views
@login_required
def submit_project(request, project_call_pk):
    project_call = get_object_or_404(ProjectCall, pk=project_call_pk)
    if request.method == 'POST':
        form = ProjectSubmissionForm(request.POST)
        if form.is_valid():
            submission = form.save(commit=False)
            submission.project_call = project_call
            submission.submitted_by = request.user
            submission.startup = request.user.startup
            submission.save()
            messages.success(request, 'Projet soumis avec succès.')
            return redirect('project_call_detail', pk=project_call_pk)
    else:
        form = ProjectSubmissionForm()
    return render(request, 'organizations/submit_project.html', {
        'form': form,
        'project_call': project_call
    })

@login_required
def review_submission(request, submission_pk):
    submission = get_object_or_404(ProjectSubmission, pk=submission_pk)
    if request.method == 'POST':
        form = ProjectSubmissionReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.submission = submission
            review.reviewer = request.user
            review.save()
            messages.success(request, 'Évaluation enregistrée avec succès.')
            return redirect('project_submission_detail', pk=submission_pk)
    else:
        form = ProjectSubmissionReviewForm()
    
    return render(request, 'organizations/review_submission.html', {
        'form': form,
        'submission': submission
    })

# Competition Views
@login_required
def competition_list(request):
    competitions = Competition.objects.filter(end_date__gte=timezone.now()).order_by('start_date')
    return render(request, 'organizations/competition_list.html', {'competitions': competitions})

@login_required
def competition_detail(request, pk):
    competition = get_object_or_404(Competition, pk=pk)
    is_registered = False
    if hasattr(request.user, 'startup'):
        is_registered = CompetitionRegistration.objects.filter(
            competition=competition,
            startup=request.user.startup
        ).exists()
    return render(request, 'organizations/competition_detail.html', {
        'competition': competition,
        'is_registered': is_registered
    })

@login_required
def competition_create(request):
    if request.method == 'POST':
        form = CompetitionForm(request.POST)
        if form.is_valid():
            competition = form.save(commit=False)
            competition.organization = request.user
            competition.save()
            messages.success(request, 'Compétition créée avec succès.')
            return redirect('competition_detail', pk=competition.pk)
    else:
        form = CompetitionForm()
    return render(request, 'organizations/competition_form.html', {'form': form})

@login_required
def register_competition(request, competition_pk):
    competition = get_object_or_404(Competition, pk=competition_pk)
    if not hasattr(request.user, 'startup'):
        messages.error(request, 'Vous devez avoir une startup pour vous inscrire à une compétition.')
        return redirect('competition_detail', pk=competition_pk)
    
    if CompetitionRegistration.objects.filter(competition=competition, startup=request.user.startup).exists():
        messages.warning(request, 'Vous êtes déjà inscrit à cette compétition.')
        return redirect('competition_detail', pk=competition_pk)
    
    if competition.registrations.count() >= competition.max_participants:
        messages.error(request, 'Cette compétition a atteint le nombre maximum de participants.')
        return redirect('competition_detail', pk=competition_pk)
    
    CompetitionRegistration.objects.create(
        competition=competition,
        startup=request.user.startup,
        registered_by=request.user
    )
    messages.success(request, 'Inscription à la compétition réussie.')
    return redirect('competition_detail', pk=competition_pk)

@login_required
def organization_dashboard(request):
    if not hasattr(request.user, 'organizationmetrics'):
        metrics = OrganizationMetrics.objects.create(organization=request.user)
    else:
        metrics = request.user.organizationmetrics
        metrics.update_metrics()
    
    # Récupérer les derniers appels à projets
    recent_project_calls = request.user.project_calls.order_by('-created_at')[:5]
    
    # Récupérer les dernières soumissions
    recent_submissions = ProjectSubmission.objects.filter(
        project_call__organization=request.user
    ).order_by('-submitted_at')[:5]
    
    # Récupérer les compétitions actives
    active_competitions = request.user.competitions.filter(
        end_date__gte=timezone.now()
    ).order_by('end_date')[:5]
    
    # Calculer les statistiques des évaluations
    submission_reviews = ProjectSubmissionReview.objects.filter(
        submission__project_call__organization=request.user
    )
    avg_scores = {
        'innovation': submission_reviews.aggregate(Avg('innovation_score'))['innovation_score__avg'] or 0,
        'feasibility': submission_reviews.aggregate(Avg('feasibility_score'))['feasibility_score__avg'] or 0,
        'market_potential': submission_reviews.aggregate(Avg('market_potential_score'))['market_potential_score__avg'] or 0,
        'team': submission_reviews.aggregate(Avg('team_score'))['team_score__avg'] or 0
    }
    
    return render(request, 'organizations/dashboard.html', {
        'metrics': metrics,
        'recent_project_calls': recent_project_calls,
        'recent_submissions': recent_submissions,
        'active_competitions': active_competitions,
        'avg_scores': avg_scores
    })
