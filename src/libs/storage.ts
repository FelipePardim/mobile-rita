import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notification from "expo-notifications";
import { format } from "date-fns";

export interface MedicineProps {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: string[];
  hour: string;
  frequency: {
    times: number;
    repeat_every: string;
  };
  dateTimeNotification: Date;
}

export interface StorageMedicineProps {
  [id: string]: {
    data: MedicineProps;
    notificationId: string;
  };
}

export async function saveMedicine(medicine: MedicineProps): Promise<void> {
  try {
    const nextTime = new Date(medicine.dateTimeNotification);
    const now = new Date();

    const { times, repeat_every } = medicine.frequency;

    if (repeat_every === "week") {
      const interval = Math.trunc(7 / times);
      nextTime.setDate(now.getDate() + interval);
    } else {
      // nextTime.setDate(nextTime.getDate() + 1);
      nextTime.setDate(nextTime.getDate());
    }

    const seconds = Math.abs(
      Math.ceil((now.getTime() - nextTime.getTime()) / 1000)
    );

    const notificationId = await Notification.scheduleNotificationAsync({
      content: {
        title: "Olá, 💊",
        body: `Está na hora de cuidar da sua saúde. Medicação:${medicine.name}`,
        sound: true,
        priority: Notification.AndroidNotificationPriority.HIGH,
        data: {
          medicine,
        },
      },
      trigger: {
        seconds: seconds < 60 ? 60 : seconds,
        repeats: true,
      },
    });

    const data = await AsyncStorage.getItem("@rita:medicines");
    const oldMedicines = data ? (JSON.parse(data) as StorageMedicineProps) : {};

    const newMedicine = {
      [medicine.id]: {
        data: medicine,
        notificationId,
      },
    };

    await AsyncStorage.setItem(
      "@rita:medicines",
      JSON.stringify({ ...newMedicine, ...oldMedicines })
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function loadMedicines(): Promise<MedicineProps[]> {
  try {
    const data = await AsyncStorage.getItem("@rita:medicines");
    const medicines = data ? (JSON.parse(data) as StorageMedicineProps) : {};

    const medicinesSorted = Object.keys(medicines)
      .map((medicine) => {
        return {
          ...medicines[medicine].data,
          hour: format(
            new Date(medicines[medicine].data.dateTimeNotification),
            "HH:mm"
          ),
        };
      })
      .sort((a, b) =>
        Math.floor(
          new Date(a.dateTimeNotification).getTime() / 1000 -
            Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
        )
      );

    return medicinesSorted;
  } catch (error) {
    throw new Error(error);
  }
}

export async function removeMedicine(id: string): Promise<void> {
  const data = await AsyncStorage.getItem("@rita:medicines");

  const medicines = data ? (JSON.parse(data) as StorageMedicineProps) : {};

  await Notification.cancelScheduledNotificationAsync(
    medicines[id].notificationId
  );

  delete medicines[id];

  await AsyncStorage.setItem("@rita:medicines", JSON.stringify(medicines));
}

export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    throw new Error(error);
  }
}
