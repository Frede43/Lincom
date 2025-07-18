from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import Conversation, Message, WorkGroup, GroupMessage

User = get_user_model()

class MessagingAPITestCase(APITestCase):
    def setUp(self):
        # Créer des utilisateurs de test
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='pass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='pass123'
        )
        self.user3 = User.objects.create_user(
            username='user3',
            email='user3@example.com',
            password='pass123'
        )
        
        # Créer une conversation
        self.conversation = Conversation.objects.create()
        self.conversation.participants.add(self.user1, self.user2)
        
        # Créer des messages
        self.message1 = Message.objects.create(
            conversation=self.conversation,
            sender=self.user1,
            content='Hello from user1'
        )
        self.message2 = Message.objects.create(
            conversation=self.conversation,
            sender=self.user2,
            content='Hi user1!'
        )
        
        # Créer un groupe de travail
        self.workgroup = WorkGroup.objects.create(
            name='Test Group',
            description='Test Description',
            creator=self.user1
        )
        self.workgroup.members.add(self.user1, self.user2)
        
        # Créer des messages de groupe
        self.group_message1 = GroupMessage.objects.create(
            group=self.workgroup,
            sender=self.user1,
            content='Welcome to the group!'
        )
        
        # Configurer le client API
        self.client = APIClient()

    def test_conversation_list(self):
        """Tester la liste des conversations"""
        self.client.force_authenticate(user=self.user1)
        url = reverse('messaging:conversation-list')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Vérifier que user3 n'a pas accès aux conversations
        self.client.force_authenticate(user=self.user3)
        response = self.client.get(url)
        self.assertEqual(len(response.data), 0)

    def test_create_conversation(self):
        """Tester la création d'une conversation"""
        self.client.force_authenticate(user=self.user1)
        url = reverse('messaging:conversation-list')
        
        data = {
            'participants': [self.user2.id, self.user3.id]
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier que la conversation a été créée avec les bons participants
        conversation = Conversation.objects.get(id=response.data['id'])
        self.assertEqual(conversation.participants.count(), 3)
        self.assertTrue(conversation.participants.filter(id=self.user1.id).exists())

    def test_send_message(self):
        """Tester l'envoi d'un message"""
        self.client.force_authenticate(user=self.user1)
        url = reverse('messaging:conversation-send-message', args=[self.conversation.id])
        
        data = {'content': 'New message'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier que le message a été créé
        message = Message.objects.get(id=response.data['id'])
        self.assertEqual(message.content, 'New message')
        self.assertEqual(message.sender, self.user1)

    def test_workgroup_operations(self):
        """Tester les opérations sur les groupes de travail"""
        self.client.force_authenticate(user=self.user1)
        
        # Créer un nouveau groupe
        url = reverse('messaging:workgroup-list')
        data = {
            'name': 'New Group',
            'description': 'New Description'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        group_id = response.data['id']
        
        # Ajouter un membre
        url = reverse('messaging:workgroup-add-member', args=[group_id])
        data = {'user_id': self.user3.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Envoyer un message au groupe
        url = reverse('messaging:workgroup-send-message', args=[group_id])
        data = {'content': 'Group message'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier que le message a été créé
        message = GroupMessage.objects.get(id=response.data['id'])
        self.assertEqual(message.content, 'Group message')
        self.assertEqual(message.sender, self.user1)

    def test_message_read_status(self):
        """Tester le statut de lecture des messages"""
        self.client.force_authenticate(user=self.user2)
        url = reverse('messaging:conversation-mark-as-read', args=[self.conversation.id])
        
        # Marquer les messages comme lus
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Vérifier que les messages sont marqués comme lus
        message = Message.objects.get(id=self.message1.id)
        self.assertTrue(message.read_by.filter(id=self.user2.id).exists())

    def test_unauthorized_access(self):
        """Tester l'accès non autorisé"""
        urls = [
            reverse('messaging:conversation-list'),
            reverse('messaging:workgroup-list')
        ]
        
        for url in urls:
            # Sans authentification
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            
            # Accès à une conversation dont l'utilisateur n'est pas participant
            self.client.force_authenticate(user=self.user3)
            response = self.client.get(
                reverse('messaging:conversation-detail', args=[self.conversation.id])
            )
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
