from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Conversation

# Create your views here.

@login_required
def inbox(request):
    conversations = Conversation.objects.filter(participants=request.user).order_by('-updated_at')
    return render(request, 'messaging/inbox.html', {
        'conversations': conversations
    })
