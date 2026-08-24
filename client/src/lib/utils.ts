import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { academicStructure } from "@/features/application/data/academicStructure";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAcronym(text: string) {
  if (!text) return "";
  
  // Try to find exact match in official academic structure first
  for (const college of academicStructure) {
    if (college.name.toLowerCase() === text.toLowerCase()) {
      return college.abbr;
    }
    for (const program of college.programs) {
      if (program.name.toLowerCase() === text.toLowerCase()) {
        return program.abbr;
      }
    }
  }

  // Fallback to automatic extraction if not found
  const stopwords = ['of', 'in', 'and', 'the', 'for', 'at'];
  return text.split(' ')
    .filter(word => word && !stopwords.includes(word.toLowerCase()))
    .map(word => word[0].toUpperCase())
    .join('');
}
