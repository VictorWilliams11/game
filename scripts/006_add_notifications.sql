-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('general', 'announcement', 'alert', 'reminder')),
  target_role TEXT CHECK (target_role IN ('student', 'admin', 'all')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create notification_reads table to track which students have seen notifications
CREATE TABLE IF NOT EXISTS public.notification_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(notification_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Admins can create notifications" ON public.notifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view notifications for their role" ON public.notifications FOR SELECT USING (
  target_role = 'all' OR 
  (target_role = 'student' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'student')) OR
  (target_role = 'admin' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')) OR
  admin_id = auth.uid()
);

CREATE POLICY "Admins can delete their notifications" ON public.notifications FOR DELETE USING (
  admin_id = auth.uid()
);

-- Notification reads policies
CREATE POLICY "Users can mark notifications as read" ON public.notification_reads FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can view their notification reads" ON public.notification_reads FOR SELECT USING (
  auth.uid() = user_id
);
