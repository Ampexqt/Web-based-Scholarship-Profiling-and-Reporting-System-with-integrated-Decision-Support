import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { ApplicationFormValues } from '../schema';
import { academicStructure } from '../data/academicStructure';

export default function Part1PersonalInfoStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ApplicationFormValues>();
  const sameAsCurrentAddress = watch("sameAsCurrentAddress");

  const selectedCollege = watch("college");
  const selectedCourse = watch("course");

  const collegeObj = academicStructure.find(c => c.name === selectedCollege);
  const programs = collegeObj ? collegeObj.programs : [];
  
  const courseObj = programs.find(p => p.name === selectedCourse);
  const majors = courseObj ? courseObj.majors : [];

  useEffect(() => {
    if (selectedCollege && !programs.find(p => p.name === selectedCourse)) {
      setValue("course", "");
      setValue("major", "");
    }
  }, [selectedCollege, programs, selectedCourse, setValue]);

  useEffect(() => {
    if (selectedCourse && courseObj) {
      if (courseObj.majors.length === 1) {
        setValue("major", courseObj.majors[0]);
      } else if (!courseObj.majors.includes(watch("major") || "")) {
        setValue("major", "");
      }
    }
  }, [selectedCourse, courseObj, setValue, watch]);

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-1">Part I. Personal Information</h2>
        <p className="text-sm text-muted-foreground">Please provide your basic details accurately.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2 md:col-span-1">
          <label className="text-sm font-medium text-foreground">Student ID No <span className="text-destructive">*</span></label>
          <input {...register("studentId")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          {errors.studentId && <p className="text-xs text-destructive">{errors.studentId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Last Name <span className="text-destructive">*</span></label>
          <input {...register("lastName")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Given Name <span className="text-destructive">*</span></label>
          <input {...register("givenName")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          {errors.givenName && <p className="text-xs text-destructive">{errors.givenName.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Middle Name</label>
          <input 
            {...register("middleName")} 
            disabled={watch("noMiddleName")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:bg-muted" 
          />
          <label className="flex items-center space-x-2 text-xs cursor-pointer pt-1">
            <input type="checkbox" {...register("noMiddleName")} className="rounded border-border text-primary focus:ring-primary h-4 w-4" />
            <span className="text-muted-foreground">Check if you do not have a middle name</span>
          </label>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Extension</label>
          <select {...register("extension")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">None</option>
            <option value="Jr.">Jr.</option>
            <option value="Sr.">Sr.</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">College <span className="text-destructive">*</span></label>
          <select {...register("college")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select College</option>
            {academicStructure.map(college => (
              <option key={college.name} value={college.name}>{college.name}</option>
            ))}
          </select>
          {errors.college && <p className="text-xs text-destructive">{errors.college.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Course / Program <span className="text-destructive">*</span></label>
          <select {...register("course")} disabled={!selectedCollege} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:bg-muted">
            <option value="">Select Course</option>
            {programs.map(prog => (
              <option key={prog.name} value={prog.name}>{prog.name}</option>
            ))}
          </select>
          {errors.course && <p className="text-xs text-destructive">{errors.course.message}</p>}
        </div>
        {majors.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Major <span className="text-destructive">*</span></label>
            <select 
              {...register("major")} 
              disabled={majors.length === 1}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:bg-muted"
            >
              <option value="">Select Major</option>
              {majors.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.major && <p className="text-xs text-destructive">{errors.major.message}</p>}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Year Level <span className="text-destructive">*</span></label>
          <select {...register("yearLevel")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          {errors.yearLevel && <p className="text-xs text-destructive">{errors.yearLevel.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Sex <span className="text-destructive">*</span></label>
          <select {...register("sex")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Birthdate <span className="text-destructive">*</span></label>
          <input type="date" {...register("birthdate")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Age <span className="text-destructive">*</span></label>
          <input type="number" {...register("age")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Civil Status <span className="text-destructive">*</span></label>
          <select {...register("civilStatus")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-foreground">Place of Birth <span className="text-destructive">*</span></label>
          <input {...register("placeOfBirth")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-foreground">Religion <span className="text-destructive">*</span></label>
          <input {...register("religion")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
      </div>

      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-serif font-bold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email Address <span className="text-destructive">*</span></label>
            <input type="email" {...register("emailAddress")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Mobile Number <span className="text-destructive">*</span></label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm font-medium">
                +63
              </span>
              <input 
                {...register("mobileNumber")} 
                placeholder="9XXXXXXXXX" 
                maxLength={10}
                className="flex-1 h-10 rounded-none rounded-r-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              />
            </div>
            {errors.mobileNumber && <p className="text-xs text-destructive">{errors.mobileNumber.message}</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-serif font-bold mb-4">Current Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">House/Lot/Block <span className="text-destructive">*</span></label>
            <input {...register("currentHouseBlock")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Street/Purok <span className="text-destructive">*</span></label>
            <input {...register("currentStreet")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Barangay <span className="text-destructive">*</span></label>
            <input {...register("currentBarangay")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Municipality/City <span className="text-destructive">*</span></label>
            <input {...register("currentMunicipality")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Province <span className="text-destructive">*</span></label>
            <input {...register("currentProvince")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Region <span className="text-destructive">*</span></label>
            <input {...register("currentRegion")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">ZIP Code <span className="text-destructive">*</span></label>
            <input {...register("currentZipCode")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-8">
        <div className="flex items-center gap-2 mb-4">
          <input type="checkbox" id="sameAsCurrent" {...register("sameAsCurrentAddress")} className="h-4 w-4 rounded border-input" />
          <label htmlFor="sameAsCurrent" className="text-lg font-serif font-bold cursor-pointer">Permanent Address</label>
          <span className="text-sm text-muted-foreground ml-2">(Check if same as Current Address)</span>
        </div>
        
        {!sameAsCurrentAddress && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">House/Lot/Block <span className="text-destructive">*</span></label>
              <input {...register("permanentHouseBlock")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Street/Purok <span className="text-destructive">*</span></label>
              <input {...register("permanentStreet")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Barangay <span className="text-destructive">*</span></label>
              <input {...register("permanentBarangay")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Municipality/City <span className="text-destructive">*</span></label>
              <input {...register("permanentMunicipality")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Province <span className="text-destructive">*</span></label>
              <input {...register("permanentProvince")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Region <span className="text-destructive">*</span></label>
              <input {...register("permanentRegion")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">ZIP Code <span className="text-destructive">*</span></label>
              <input {...register("permanentZipCode")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-serif font-bold mb-4">Enrollment Information</h3>
        <div className="space-y-2 max-w-sm">
          <label className="text-sm font-medium text-foreground">Student Classification <span className="text-destructive">*</span></label>
          <select {...register("studentClassification")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Select Classification</option>
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
            <option value="Transferee">Transferee</option>
            <option value="Returnee">Returnee</option>
            <option value="Continuing Student">Continuing Student</option>
          </select>
        </div>
      </div>
    </div>
  );
}
