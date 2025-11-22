import { describe, it, expect } from 'vitest';
import {
  predictFormSchema,
  calculateBMI,
  getBMICategory,
  formatFormDataForAPI,
  type PredictFormSchema,
} from './validation';

describe('Prediction Form Validation', () => {
  describe('predictFormSchema', () => {
    it('should accept valid form data', () => {
      const validData: PredictFormSchema = {
        name: 'Nguyen Van A',
        gender: 1,
        age: 25,
        height: 170, // Height in centimeters
        weight: 65,
        family_history_with_overweight: 'yes',
        FAVC: 'yes',
        SCC: 2,
        FCVC: 2,
        CH2O: 2,
        NCP: 3,
        CAEC: 1,
        FAF: 2,
        TUE: 1,
        MTRANS: 3,
        SMOKE: 'no',
        CALC: 1,
      };

      const result = predictFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty required fields', () => {
      const invalidData = {
        name: '', // Empty name
        gender: 0,
        age: 25,
        height: 170, // Height in centimeters
        weight: 65,
        family_history_with_overweight: 'yes',
        FAVC: 'yes',
        SCC: 2,
        FCVC: 2,
        CH2O: 2,
        NCP: 3,
        CAEC: 1,
        FAF: 2,
        TUE: 1,
        MTRANS: 3,
        SMOKE: 'no',
        CALC: 1,
      };

      const result = predictFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    describe('yes/no fields validation', () => {
      it('should accept "yes" for family_history_with_overweight', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should accept "no" for family_history_with_overweight', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'no',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should reject empty string for family_history_with_overweight on validation', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: '', // Empty should be rejected by refinement
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Vui lòng chọn');
        }
      });

      it('should accept "yes" for FAVC', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should accept "no" for FAVC', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'no',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should reject empty string for FAVC on validation', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: '',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should accept "yes" for SMOKE', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'yes',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should accept "no" for SMOKE', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should reject empty string for SMOKE on validation', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: '',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe('numeric field validation', () => {
      it('should reject age below minimum (1)', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 0, // Invalid
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject age above maximum (120)', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 121, // Invalid
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should accept valid age range', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 50,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should reject height below minimum (50 cm)', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 40, // Invalid - below 50 cm
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject height above maximum (250 cm)', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 260, // Invalid - above 250 cm
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject weight below minimum (20)', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 19, // Invalid
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should reject weight above maximum (300)', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 301, // Invalid
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should validate CAEC range (0-4)', () => {
        const validData = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 3,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(validData);
        expect(result.success).toBe(true);

        // Test invalid value
        const invalidData = { ...validData, CAEC: 5 };
        const invalidResult = predictFormSchema.safeParse(invalidData);
        expect(invalidResult.success).toBe(false);
      });

      it('should validate FAF range (0-3)', () => {
        const validData = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 3,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(validData);
        expect(result.success).toBe(true);

        // Test invalid value
        const invalidData = { ...validData, FAF: 4 };
        const invalidResult = predictFormSchema.safeParse(invalidData);
        expect(invalidResult.success).toBe(false);
      });

      it('should validate TUE range (0-2)', () => {
        const validData = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 2,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(validData);
        expect(result.success).toBe(true);

        // Test invalid value
        const invalidData = { ...validData, TUE: 3 };
        const invalidResult = predictFormSchema.safeParse(invalidData);
        expect(invalidResult.success).toBe(false);
      });

      it('should validate MTRANS range (1-5)', () => {
        const validData = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 5,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(validData);
        expect(result.success).toBe(true);

        // Test invalid value
        const invalidData = { ...validData, MTRANS: 6 };
        const invalidResult = predictFormSchema.safeParse(invalidData);
        expect(invalidResult.success).toBe(false);
      });
    });

    describe('gender validation', () => {
      it('should accept gender 0 (female)', () => {
        const data = {
          name: 'Test',
          gender: 0,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should accept gender 1 (male)', () => {
        const data = {
          name: 'Test',
          gender: 1,
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should reject invalid gender value', () => {
        const data = {
          name: 'Test',
          gender: 2, // Invalid
          age: 25,
          height: 170, // Height in centimeters
          weight: 65,
          family_history_with_overweight: 'yes',
          FAVC: 'yes',
          SCC: 2,
          FCVC: 2,
          CH2O: 2,
          NCP: 3,
          CAEC: 1,
          FAF: 2,
          TUE: 1,
          MTRANS: 3,
          SMOKE: 'no',
          CALC: 1,
        };

        const result = predictFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('calculateBMI', () => {
    it('should calculate BMI correctly', () => {
      // BMI = weight / (height_in_meters^2)
      // For height 170cm (1.7m) and weight 65kg:
      // BMI = 65 / (1.7^2) = 65 / 2.89 = 22.5
      const bmi = calculateBMI('170', '65');
      expect(bmi).toBeCloseTo(22.5, 1);
    });

    it('should return null for invalid height', () => {
      const bmi = calculateBMI('invalid', '65');
      expect(bmi).toBeNull();
    });

    it('should return null for invalid weight', () => {
      const bmi = calculateBMI('170', 'invalid');
      expect(bmi).toBeNull();
    });

    it('should return null for zero height', () => {
      const bmi = calculateBMI('0', '65');
      expect(bmi).toBeNull();
    });

    it('should return null for zero weight', () => {
      const bmi = calculateBMI('170', '0');
      expect(bmi).toBeNull();
    });

    it('should return null for negative values', () => {
      expect(calculateBMI('-170', '65')).toBeNull();
      expect(calculateBMI('170', '-65')).toBeNull();
    });
  });

  describe('getBMICategory', () => {
    it('should return "Thiếu cân" for BMI < 18.5', () => {
      expect(getBMICategory(18.4)).toBe('Thiếu cân');
    });

    it('should return "Bình thường" for 18.5 <= BMI < 23', () => {
      expect(getBMICategory(18.5)).toBe('Bình thường');
      expect(getBMICategory(22)).toBe('Bình thường');
    });

    it('should return "Thừa cân" for 23 <= BMI < 25', () => {
      expect(getBMICategory(23)).toBe('Thừa cân');
      expect(getBMICategory(24.5)).toBe('Thừa cân');
    });

    it('should return "Béo phì độ I" for 25 <= BMI < 30', () => {
      expect(getBMICategory(25)).toBe('Béo phì độ I');
      expect(getBMICategory(29)).toBe('Béo phì độ I');
    });

    it('should return "Béo phì độ II" for BMI >= 30', () => {
      expect(getBMICategory(30)).toBe('Béo phì độ II');
      expect(getBMICategory(35)).toBe('Béo phì độ II');
    });
  });

  describe('formatFormDataForAPI', () => {
    it('should format form data correctly for API', () => {
      const formData: PredictFormSchema = {
        name: 'Nguyen Van A',
        gender: 1,
        age: 25,
        height: 170, // Height in centimeters
        weight: 65,
        family_history_with_overweight: 'yes',
        FAVC: 'yes',
        SCC: 1,
        FCVC: 2,
        CH2O: 2,
        NCP: 3,
        CAEC: 2,
        FAF: 2,
        TUE: 1,
        MTRANS: 3,
        SMOKE: 'no',
        CALC: 1,
      };

      const formatted = formatFormDataForAPI(formData);

      expect(formatted.demographics.name).toBe('Nguyen Van A');
      expect(formatted.demographics.gender).toBe(1);
      expect(formatted.demographics.age).toBe(25);
      expect(formatted.demographics.familyHistory).toBe(true);
      expect(formatted.demographics.height).toBe(170); // Now correctly in centimeters
      expect(formatted.demographics.weight).toBe(65);
      // BMI calculation now works correctly with height in cm
      expect(formatted.demographics.bmi).toBeCloseTo(22.5, 1);

      expect(formatted.eatingHabits.highCalorieFood).toBe(true);
      expect(formatted.eatingHabits.calorieTracking).toBe(true);
      expect(formatted.eatingHabits.vegetableConsumption).toBe(2);
      expect(formatted.eatingHabits.waterIntake).toBe(2);
      expect(formatted.eatingHabits.mainMeals).toBe('3');
      expect(formatted.eatingHabits.snacking).toBe(2);

      expect(formatted.activityHabits.exercise).toBe(2);
      expect(formatted.activityHabits.screenTime).toBe(1);
      expect(formatted.activityHabits.transportation).toBe(3);

      expect(formatted.otherHabits.smoking).toBe(false);
      expect(formatted.otherHabits.alcohol).toBe(1);
    });

    it('should convert "yes" to true for boolean fields', () => {
      const formData: PredictFormSchema = {
        name: 'Test',
        gender: 0,
        age: 25,
        height: 170, // Height in centimeters
        weight: 65,
        family_history_with_overweight: 'yes',
        FAVC: 'yes',
        SCC: 1,
        FCVC: 2,
        CH2O: 2,
        NCP: 3,
        CAEC: 1,
        FAF: 2,
        TUE: 1,
        MTRANS: 3,
        SMOKE: 'yes',
        CALC: 1,
      };

      const formatted = formatFormDataForAPI(formData);

      expect(formatted.demographics.familyHistory).toBe(true);
      expect(formatted.eatingHabits.highCalorieFood).toBe(true);
      expect(formatted.otherHabits.smoking).toBe(true);
    });

    it('should convert "no" to false for boolean fields', () => {
      const formData: PredictFormSchema = {
        name: 'Test',
        gender: 0,
        age: 25,
        height: 170, // Height in centimeters
        weight: 65,
        family_history_with_overweight: 'no',
        FAVC: 'no',
        SCC: 1,
        FCVC: 2,
        CH2O: 2,
        NCP: 3,
        CAEC: 1,
        FAF: 2,
        TUE: 1,
        MTRANS: 3,
        SMOKE: 'no',
        CALC: 1,
      };

      const formatted = formatFormDataForAPI(formData);

      expect(formatted.demographics.familyHistory).toBe(false);
      expect(formatted.eatingHabits.highCalorieFood).toBe(false);
      expect(formatted.otherHabits.smoking).toBe(false);
    });

    it('should handle CAEC as numeric field correctly', () => {
      const formData: PredictFormSchema = {
        name: 'Test',
        gender: 0,
        age: 25,
        height: 170, // Height in centimeters
        weight: 65,
        family_history_with_overweight: 'yes',
        FAVC: 'yes',
        SCC: 1,
        FCVC: 2,
        CH2O: 2,
        NCP: 3,
        CAEC: 3, // Should remain numeric, not converted to boolean
        FAF: 2,
        TUE: 1,
        MTRANS: 3,
        SMOKE: 'no',
        CALC: 1,
      };

      const formatted = formatFormDataForAPI(formData);

      expect(formatted.eatingHabits.snacking).toBe(3);
      expect(typeof formatted.eatingHabits.snacking).toBe('number');
    });

    it('should handle SCC correctly for calorie tracking', () => {
      const formDataYes: PredictFormSchema = {
        name: 'Test',
        gender: 0,
        age: 25,
        height: 170, // Height in centimeters
        weight: 65,
        family_history_with_overweight: 'yes',
        FAVC: 'yes',
        SCC: 1, // Should be true
        FCVC: 2,
        CH2O: 2,
        NCP: 3,
        CAEC: 1,
        FAF: 2,
        TUE: 1,
        MTRANS: 3,
        SMOKE: 'no',
        CALC: 1,
      };

      const formattedYes = formatFormDataForAPI(formDataYes);
      expect(formattedYes.eatingHabits.calorieTracking).toBe(true);

      const formDataNo: PredictFormSchema = {
        ...formDataYes,
        SCC: 2, // Should be false
      };

      const formattedNo = formatFormDataForAPI(formDataNo);
      expect(formattedNo.eatingHabits.calorieTracking).toBe(false);
    });
  });
});
