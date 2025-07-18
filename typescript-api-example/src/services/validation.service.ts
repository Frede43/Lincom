import { ApiService } from './api';

export interface ValidationRule {
  type: string;
  options?: any;
  message?: string;
}

export interface ValidationError {
  field: string;
  rule: string;
  message: string;
  details?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

export class ValidationService {
  private api = ApiService.getInstance().getApi();

  // Règles de validation courantes
  static rules = {
    required: () => ({
      type: 'required',
      message: 'Ce champ est requis'
    }),

    email: () => ({
      type: 'email',
      message: 'Email invalide'
    }),

    minLength: (min: number) => ({
      type: 'minLength',
      options: { min },
      message: `Minimum ${min} caractères requis`
    }),

    maxLength: (max: number) => ({
      type: 'maxLength',
      options: { max },
      message: `Maximum ${max} caractères autorisés`
    }),

    pattern: (regex: RegExp, message?: string) => ({
      type: 'pattern',
      options: { pattern: regex.source },
      message: message || 'Format invalide'
    }),

    range: (min: number, max: number) => ({
      type: 'range',
      options: { min, max },
      message: `La valeur doit être entre ${min} et ${max}`
    }),

    enum: (values: any[]) => ({
      type: 'enum',
      options: { values },
      message: `La valeur doit être l'une des suivantes : ${values.join(', ')}`
    }),

    custom: (validator: (value: any) => boolean | Promise<boolean>, message: string) => ({
      type: 'custom',
      options: { validator },
      message
    })
  };

  // Validation de base
  async validate(data: any, schema: ValidationSchema): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      for (const rule of rules) {
        const error = await this.validateRule(field, value, rule);
        if (error) {
          errors.push(error);
          break; // Arrêter à la première erreur pour ce champ
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private async validateRule(field: string, value: any, rule: ValidationRule): Promise<ValidationError | null> {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          return {
            field,
            rule: 'required',
            message: rule.message || 'Ce champ est requis'
          };
        }
        break;

      case 'email':
        if (value && !this.isValidEmail(value)) {
          return {
            field,
            rule: 'email',
            message: rule.message || 'Email invalide'
          };
        }
        break;

      case 'minLength':
        if (value && value.length < rule.options.min) {
          return {
            field,
            rule: 'minLength',
            message: rule.message || `Minimum ${rule.options.min} caractères requis`
          };
        }
        break;

      case 'maxLength':
        if (value && value.length > rule.options.max) {
          return {
            field,
            rule: 'maxLength',
            message: rule.message || `Maximum ${rule.options.max} caractères autorisés`
          };
        }
        break;

      case 'pattern':
        if (value && !new RegExp(rule.options.pattern).test(value)) {
          return {
            field,
            rule: 'pattern',
            message: rule.message || 'Format invalide'
          };
        }
        break;

      case 'range':
        if (value !== undefined && (value < rule.options.min || value > rule.options.max)) {
          return {
            field,
            rule: 'range',
            message: rule.message || `La valeur doit être entre ${rule.options.min} et ${rule.options.max}`
          };
        }
        break;

      case 'enum':
        if (value !== undefined && !rule.options.values.includes(value)) {
          return {
            field,
            rule: 'enum',
            message: rule.message || `Valeur invalide`
          };
        }
        break;

      case 'custom':
        try {
          const isValid = await rule.options.validator(value);
          if (!isValid) {
            return {
              field,
              rule: 'custom',
              message: rule.message || 'Validation personnalisée échouée'
            };
          }
        } catch (error) {
          return {
            field,
            rule: 'custom',
            message: rule.message || 'Erreur lors de la validation',
            details: error
          };
        }
        break;
    }

    return null;
  }

  // Validations spécifiques
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async validatePassword(password: string): Promise<ValidationResult> {
    const schema = {
      password: [
        ValidationService.rules.required(),
        ValidationService.rules.minLength(8),
        ValidationService.rules.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
        )
      ]
    };

    return this.validate({ password }, schema);
  }

  async validateUser(user: any): Promise<ValidationResult> {
    const schema = {
      email: [
        ValidationService.rules.required(),
        ValidationService.rules.email()
      ],
      username: [
        ValidationService.rules.required(),
        ValidationService.rules.minLength(3),
        ValidationService.rules.maxLength(20),
        ValidationService.rules.pattern(/^[a-zA-Z0-9_-]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores')
      ],
      age: [
        ValidationService.rules.range(13, 120)
      ]
    };

    return this.validate(user, schema);
  }

  async validateCourse(course: any): Promise<ValidationResult> {
    const schema = {
      title: [
        ValidationService.rules.required(),
        ValidationService.rules.minLength(5),
        ValidationService.rules.maxLength(100)
      ],
      description: [
        ValidationService.rules.required(),
        ValidationService.rules.minLength(20),
        ValidationService.rules.maxLength(1000)
      ],
      level: [
        ValidationService.rules.required(),
        ValidationService.rules.enum(['beginner', 'intermediate', 'advanced'])
      ],
      price: [
        ValidationService.rules.range(0, 1000)
      ]
    };

    return this.validate(course, schema);
  }

  // Validation asynchrone avec le serveur
  async validateUnique(field: string, value: string, excludeId?: string): Promise<boolean> {
    try {
      const response = await this.api.post('/validation/unique', {
        field,
        value,
        excludeId
      });
      return response.data.isUnique;
    } catch (error) {
      console.error('Erreur lors de la validation d\'unicité:', error);
      return false;
    }
  }

  async validateRecaptcha(token: string): Promise<boolean> {
    try {
      const response = await this.api.post('/validation/recaptcha', { token });
      return response.data.isValid;
    } catch (error) {
      console.error('Erreur lors de la validation reCAPTCHA:', error);
      return false;
    }
  }

  // Utilitaires
  createValidator(schema: ValidationSchema) {
    return async (data: any) => this.validate(data, schema);
  }

  combineValidators(...validators: Array<(data: any) => Promise<ValidationResult>>) {
    return async (data: any) => {
      const results = await Promise.all(validators.map(v => v(data)));
      const errors = results.flatMap(r => r.errors);
      return {
        isValid: errors.length === 0,
        errors
      };
    };
  }
}
