-- Create table for VOD contents
CREATE TABLE public.vod_contents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  category TEXT NOT NULL DEFAULT 'ACADEMY TV',
  order_position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vod_contents ENABLE ROW LEVEL SECURITY;

-- Create policies for VOD contents
CREATE POLICY "Anyone can view VOD contents" 
ON public.vod_contents 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage VOD contents" 
ON public.vod_contents 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vod_contents_updated_at
BEFORE UPDATE ON public.vod_contents
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();