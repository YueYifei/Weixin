#!/usr/bin/python
#-*-coding:utf-8-*-
import random
import string
from urlhandler.models import *
from queryhandler.settings import QRCODE_URL
from django.db.models import F
from django.db import transaction

from django.http import HttpResponse, Http404
from django.template import RequestContext
from django.shortcuts import render_to_response
from urlhandler.settings import STATIC_URL
import urllib, urllib2
from django.utils import timezone
import datetime
import qrcode


def choose_region(openid, actid, seat, now):
    with transaction.atomic():
        USER=User.objects.filter(weixin_id=openid, status=1)
        if not USER.exists():
            return HttpResponse('userNotExist')			#
		
        user = User.objects.filter(weixin_id=openid)[0]
    
		
        activities = Activity.objects.select_for_update().filter(status=1 , book_end__gt=now, book_start__lt=now, id=actid)
        
        if not activities.exists():
            return HttpResponse('actNotExist')			#
        else:
            activity = activities[0]

        if (seat != 'A') and (seat != 'B') and (seat != 'C') and (seat != 'D'):
            tickets = Ticket.objects.select_for_update().filter(stu_id=user.stu_id, activity=activity)
            if (not tickets.exists()) or (tickets[0].status != 1):
                return HttpResponse('TicketNotExist')       #

           
            tem_seat = seat
            ticket = tickets[0]
            Area = ticket.area			
            checkTickets = Ticket.objects.select_for_update().filter(status=1 ,seatId = tem_seat, area=Area, activity=activity)
            if not checkTickets.exists():
               
               ticket.seatId = tem_seat
               ticket.save()
               return HttpResponse('OK')
            else:
               return HttpResponse('Error')
        else:
  
            if seat == 'A':
                if activity.remain_tickets_A <= 0:
                    return HttpResponse('NoTicket')				#
            if seat == 'B':
                if activity.remain_tickets_B <= 0:
                    return HttpResponse('NoTicket')				#
            if seat == 'C':
                if activity.remain_tickets_C <= 0:
                    return HttpResponse('NoTicket')				#
            if seat == 'D':
                if activity.remain_tickets_D <= 0:
                    return HttpResponse('NoTicket')				#
    			
    
            random_string = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])
            while Ticket.objects.filter(unique_id=random_string).exists():
                random_string = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])
        

            tickets = Ticket.objects.select_for_update().filter(stu_id=user.stu_id, activity=activity)
            if tickets.exists() and tickets[0].status != 0:
    
                return HttpResponse('Error')				#

            next_seat = seat
            st =  'remain_tickets'+ '_' + seat
            if not tickets.exists():
               
               if seat == 'A':
                   Activity.objects.filter(id=activity.id).update(remain_tickets_A=F(st)-1)
               if seat == 'B':
                   Activity.objects.filter(id=activity.id).update(remain_tickets_B=F(st)-1)
               if seat == 'C':
                   Activity.objects.filter(id=activity.id).update(remain_tickets_C=F(st)-1)
               if seat == 'D':
                   Activity.objects.filter(id=activity.id).update(remain_tickets_D=F(st)-1)
               rank = (activity.total_tickets_A+activity.total_tickets_B+activity.total_tickets_C+activity.total_tickets_D) - (activity.remain_tickets_A+activity.remain_tickets_B+activity.remain_tickets_C+activity.remain_tickets_D)
               ticket = Ticket.objects.create(
                      stu_id=user.stu_id,
                      activity_id=activity.id,
                      unique_id=random_string,
                      status=1,
                      area=next_seat,
                      seatId = -1,
                      type = 2
               )
               print seat
               if seat == 'A':
                   active_seats = activity.seats_for_choose_A.split(',')
                   active_seats = getActiveSeats(seat, active_seats)
                   return HttpResponse('OK1_'+str(rank)+'_'+active_seats)	
               if seat == 'B':
                   active_seats = activity.seats_for_choose_B.split(',')
                   choosen_tickets = Ticket.objects.select_for_update().filter(activity_id = actid, status = 1, area = seat)
                   if choosen_tickets.exists():
                       choosen_seats = []
                       for item in choosen_tickets:
                           choosen_seats.append(item.seatId)
                       for iticket in active_seats:
                           if (iticket in choosen_seats):
                                active_seats.remove(iticket)
                       active_seats = ','.join(active_seats)
                       print active_seats
                   return HttpResponse('OK1_'+str(rank)+'_'+active_seats)     
               if seat == 'C':
                   active_seats = activity.seats_for_choose_C.split(',')
                   choosen_tickets = Ticket.objects.select_for_update().filter(activity_id = actid, status = 1, area = seat)
                   if choosen_tickets.exists():
                       choosen_seats = []
                       for item in choosen_tickets:
                           choosen_seats.append(item.seatId)
                       for iticket in active_seats:
                           if (iticket in choosen_seats):
                                active_seats.remove(iticket)
                       active_seats = ','.join(active_seats)
                       print active_seats
                   return HttpResponse('OK1_'+str(rank)+'_'+active_seats)  
               if seat == 'D':
                   active_seats = activity.seats_for_choose_D.split(',')
                   choosen_tickets = Ticket.objects.select_for_update().filter(activity_id = actid, status = 1, area = seat)
                   if choosen_tickets.exists():
                       choosen_seats = []
                       for item in choosen_tickets:
                           choosen_seats.append(item.seatId)
                       for iticket in active_seats:
                           if (iticket in choosen_seats):
                                active_seats.remove(iticket)
                       active_seats = ','.join(active_seats)
                       print active_seats
                   return HttpResponse('OK1_'+str(rank)+'_'+active_seats) 

            elif tickets[0].status == 0:
               if seat == 'A':
                   Activity.objects.filter(id=activity.id).update(remain_tickets_A=F(st)-1)
               if seat == 'B':
                   Activity.objects.filter(id=activity.id).update(remain_tickets_B=F(st)-1)
               if seat == 'C':
                   Activity.objects.filter(id=activity.id).update(remain_tickets_C=F(st)-1)
               if seat == 'D':
                   Activity.objects.filter(id=activity.id).update(remain_tickets_D=F(st)-1)
               rank = (activity.total_tickets_A+activity.total_tickets_B+activity.total_tickets_C+activity.total_tickets_D) - (activity.remain_tickets_A+activity.remain_tickets_B+activity.remain_tickets_C+activity.remain_tickets_D)
               ticket = tickets[0]
               ticket.status = 1
               ticket.area = next_seat
               ticket.seatId = -1
               ticket.save()

               if seat == 'A':
                   active_seats = activity.seats_for_choose_A.split(',')
                   choosen_tickets = Ticket.objects.select_for_update().filter(activity_id = actid, status = 1, area = seat)
                   if choosen_tickets.exists():
                       choosen_seats = []
                       for item in choosen_tickets:
                           choosen_seats.append(item.seatId)
                       for iticket in active_seats:
                           if (iticket in choosen_seats):
                                active_seats.remove(iticket)
                       active_seats = ','.join(active_seats)

                   return HttpResponse('OK1_'+str(rank)+'_'+active_seats) 
               if seat == 'B':
                   active_seats = activity.seats_for_choose_B.split(',')
                   choosen_tickets = Ticket.objects.select_for_update().filter(activity_id = actid, status = 1, area = seat)
                   if choosen_tickets.exists():
                       choosen_seats = []
                       for item in choosen_tickets:
                           choosen_seats.append(item.seatId)
                       for iticket in active_seats:
                           if (iticket in choosen_seats):
                                active_seats.remove(iticket)
                       active_seats = ','.join(active_seats)

                   return HttpResponse('OK1_'+str(rank)+'_'+active_seats)   
               if seat == 'C':
                   active_seats = activity.seats_for_choose_C.split(',')
                   choosen_tickets = Ticket.objects.select_for_update().filter(activity_id = actid, status = 1, area = seat)
                   if choosen_tickets.exists():
                       choosen_seats = []
                       for item in choosen_tickets:
                           choosen_seats.append(item.seatId)
                       for iticket in active_seats:
                           if (iticket in choosen_seats):
                                active_seats.remove(iticket)
                       active_seats = ','.join(active_seats)

                   return HttpResponse('OK1_'+str(rank)+'_'+active_seats)   
               if seat == 'D':
                   active_seats = activity.seats_for_choose_D.split(',')
                   choosen_tickets = Ticket.objects.select_for_update().filter(activity_id = actid, status = 1, area = seat)
                   if choosen_tickets.exists():
                       choosen_seats = []
                       for item in choosen_tickets:
                           choosen_seats.append(item.seatId)
                       for iticket in active_seats:
                           if (iticket in choosen_seats):
                                active_seats.remove(iticket)
                       active_seats = ','.join(active_seats)

                   return HttpResponse('OK1_'+str(rank)+'_'+active_seats) 
            else:

                return HttpResponse('TicketBooked')		 #



def getActiveSeats(seat, active_seats):
    print active_seats
    choosen_tickets = Ticket.objects.select_for_update().filter(activity_id = actid, status = 1, area = seat)
    if choosen_tickets.exists():
        choosen_seats = []
        for item in choosen_tickets:
            choosen_seats.append(item.seatId)
        for iticket in active_seats:
            if (iticket in choosen_seats):
                 active_seats.remove(iticket)  
        active_seats = ','.join(active_seats)  
    return active_seats
