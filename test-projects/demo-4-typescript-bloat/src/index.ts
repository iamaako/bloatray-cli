// Only using zod and commander — rest is bloat
import { z } from 'zod';
import { Command } from 'commander';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0),
});

const program = new Command();

program
  .name('myapp')
  .description('A sample TypeScript CLI')
  .version('1.0.0');

program
  .command('validate')
  .argument('<json>', 'JSON string to validate')
  .action((json: string) => {
    try {
      const data = userSchema.parse(JSON.parse(json));
      console.log('Valid user:', data);
    } catch (err) {
      console.error('Invalid input:', err);
    }
  });

program.parse();
