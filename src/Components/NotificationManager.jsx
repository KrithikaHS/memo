import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/localClient';
import { isPast } from 'date-fns';
import { useToast } from './ui/use-toast';

export function NotificationManager() {
    const { data: reminders = [], isLoading } = useQuery({
        queryKey: ['reminders'],
        queryFn: () => base44.Reminder.list(),
        refetchInterval: 30000, // Check every 30s
    });

    const { data: laundryLoads = [] } = useQuery({
        queryKey: ['laundryLoads'],
        queryFn: () => base44.LaundryLoad.list(),
        refetchInterval: 3600000, // Check every hour
    });

    const { toast } = useToast();
    const [permission, setPermission] = useState(Notification.permission);
    const notifiedRef = useRef(new Set());
    const hasCheckedMissed = useRef(false);

    useEffect(() => {
        if (!("Notification" in window)) {
            console.warn("This browser does not support desktop notification");
            return;
        }

        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission().then((p) => {
                setPermission(p);
                if (p === 'granted') {
                    toast({
                        title: "Notifications Enabled",
                        description: "You'll receive alerts for your reminders.",
                    });
                }
            });
        }
    }, [toast]);

    useEffect(() => {
        // Wait for permission and data loading
        if (permission !== "granted") return;
        if (isLoading) return;

        const now = new Date();

        // 1. Check for missed reminders on initial load (only once)
        if (!hasCheckedMissed.current && reminders.length > 0) {
            const missedReminders = reminders.filter(r =>
                !r.completed &&
                r.due_date &&
                isPast(new Date(r.due_date)) &&
                // Only notify if missed within the last 24 hours to avoid ancient spam
                (now - new Date(r.due_date) < 24 * 60 * 60 * 1000)
            );

            if (missedReminders.length > 0) {
                new Notification("Missed Reminders", {
                    body: `You have ${missedReminders.length} overdue reminders.`,
                    icon: '/vite.svg'
                });
                // Mark them as notified so we don't buzz again
                missedReminders.forEach(r => notifiedRef.current.add(r.id));
            }
            hasCheckedMissed.current = true;
        }

        // 2. Check for reminders active right now
        reminders.forEach(reminder => {
            if (!reminder.completed && reminder.due_date) {
                const dueDate = new Date(reminder.due_date);
                const diff = Math.abs(now - dueDate);

                // Notify if within a 1-minute window
                if (diff < 60000 && !notifiedRef.current.has(reminder.id)) {
                    new Notification("Reminder", {
                        body: reminder.title,
                        icon: '/vite.svg',
                        requireInteraction: true
                    });
                    notifiedRef.current.add(reminder.id);
                }
            }
        });

        // 3. Check Laundry
        const lastLaundryNotify = localStorage.getItem('lastLaundryNotify');
        const today = new Date().toDateString();

        if (lastLaundryNotify !== today) {
            const pendingLaundry = laundryLoads.filter(l => l.status !== 'complete');
            if (pendingLaundry.length > 0) {
                new Notification("Laundry Reminder", {
                    body: `You have ${pendingLaundry.length} pending laundry loads.`,
                    icon: '/vite.svg'
                });
                localStorage.setItem('lastLaundryNotify', today);
            }
        }

    }, [reminders, laundryLoads, permission, isLoading]);

    return null;
}
