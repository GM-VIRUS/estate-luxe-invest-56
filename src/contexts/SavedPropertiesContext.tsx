
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Property } from "../types/property";
import { useToast } from "@/hooks/use-toast";

interface SavedPropertiesContextType {
  savedProperties: Property[];
  saveProperty: (property: Property) => void;
  removeProperty: (propertyId: string) => void;
  isSaved: (propertyId: string) => boolean;
}

const SavedPropertiesContext = createContext<SavedPropertiesContextType | undefined>(undefined);

export const SavedPropertiesProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);

  // Load saved properties from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedProperties");
    if (saved) {
      try {
        setSavedProperties(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing saved properties:", error);
      }
    }
  }, []);

  // Save to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem("savedProperties", JSON.stringify(savedProperties));
  }, [savedProperties]);

  const saveProperty = (property: Property) => {
    if (!isSaved(property.id)) {
      setSavedProperties((prev) => [...prev, property]);
      toast({
        title: "Property Saved",
        description: `${property.title} has been added to your saved properties.`,
      });
    } else {
      removeProperty(property.id);
    }
  };

  const removeProperty = (propertyId: string) => {
    setSavedProperties((prev) => {
      const filtered = prev.filter((p) => p.id !== propertyId);
      if (prev.length !== filtered.length) {
        toast({
          title: "Property Removed",
          description: "Property has been removed from your saved list.",
        });
      }
      return filtered;
    });
  };

  const isSaved = (propertyId: string) => {
    return savedProperties.some((p) => p.id === propertyId);
  };

  return (
    <SavedPropertiesContext.Provider value={{ savedProperties, saveProperty, removeProperty, isSaved }}>
      {children}
    </SavedPropertiesContext.Provider>
  );
};

export const useSavedProperties = () => {
  const context = useContext(SavedPropertiesContext);
  if (context === undefined) {
    throw new Error("useSavedProperties must be used within a SavedPropertiesProvider");
  }
  return context;
};
