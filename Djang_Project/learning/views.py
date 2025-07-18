from django.shortcuts import render
from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from .models import Course, Training, Category
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.db.models import Q

# Create your views here.

class CourseListView(ListView):
    model = Course
    template_name = 'learning/course_list.html'
    context_object_name = 'courses'
    ordering = ['-created_at']
    paginate_by = 9

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('search')
        category = self.request.GET.get('category')
        level = self.request.GET.get('level')
        
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )
        if category:
            queryset = queryset.filter(category_id=category)
        if level:
            queryset = queryset.filter(level=level)
        
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context

class CourseDetailView(DetailView):
    model = Course
    template_name = 'learning/course_detail.html'
    context_object_name = 'course'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.user.is_authenticated:
            context['is_enrolled'] = self.object.students.filter(id=self.request.user.id).exists()
        return context

class TrainingListView(ListView):
    model = Training
    template_name = 'learning/training_list.html'
    context_object_name = 'trainings'
    ordering = ['start_date']
    paginate_by = 9

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('search')
        category = self.request.GET.get('category')
        
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )
        if category:
            queryset = queryset.filter(category_id=category)
        
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context

class TrainingDetailView(DetailView):
    model = Training
    template_name = 'learning/training_detail.html'
    context_object_name = 'training'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.user.is_authenticated:
            context['is_registered'] = self.object.participants.filter(id=self.request.user.id).exists()
            if context['is_registered']:
                context['registration'] = self.object.trainingregistration_set.get(participant=self.request.user)
        return context

def enroll_course(request, pk):
    if not request.user.is_authenticated:
        messages.error(request, "Vous devez être connecté pour vous inscrire à un cours.")
        return redirect('admin:login')
    
    course = get_object_or_404(Course, pk=pk)
    if course.students.filter(id=request.user.id).exists():
        messages.info(request, "Vous êtes déjà inscrit à ce cours.")
    else:
        course.students.add(request.user)
        messages.success(request, f"Vous êtes maintenant inscrit au cours : {course.title}")
    return redirect('learning:course_detail', pk=pk)

def register_training(request, pk):
    if not request.user.is_authenticated:
        messages.error(request, "Vous devez être connecté pour vous inscrire à une formation.")
        return redirect('admin:login')
    
    training = get_object_or_404(Training, pk=pk)
    if training.participants.filter(id=request.user.id).exists():
        messages.info(request, "Vous êtes déjà inscrit à cette formation.")
        return redirect('learning:training_detail', pk=pk)
    
    if training.participants.count() >= training.max_participants:
        messages.error(request, "Désolé, cette formation est complète.")
        return redirect('learning:training_detail', pk=pk)
    
    training.participants.add(request.user)
    messages.success(request, f"Votre inscription à la formation {training.title} a été enregistrée.")
    return redirect('learning:training_detail', pk=pk)
