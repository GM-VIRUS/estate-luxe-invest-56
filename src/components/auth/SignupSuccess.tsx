
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SignupSuccessProps {
  countdown: number;
}

const SignupSuccess = ({ countdown }: SignupSuccessProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === 0) {
      navigate('/');
    }
  }, [countdown, navigate]);

  return (
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center justify-center size-20 rounded-full bg-green-100 dark:bg-green-900 mb-4">
        <CheckCircle className="size-10 text-green-600 dark:text-green-400" />
      </div>
      
      <h2 className="text-2xl font-bold">Account Successfully Created!</h2>
      
      <p className="text-muted-foreground">
        Your account has been verified and created successfully.
        <br />
        You will be redirected to the dashboard in <span className="font-medium">{countdown}</span> seconds.
      </p>
      
      <Button 
        onClick={() => navigate('/')}
        className="w-full md:w-auto bg-accent hover:bg-accent/90 transition-all rounded-md h-11 group"
      >
        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
      </Button>
    </div>
  );
};

export default SignupSuccess;
