class Master:
    def __init__(self, master_id: int, name: str) -> None:
        self.master_id = master_id
        self.name = name


class Service:
    def __init__(self, service_id: int, name: str) -> None:
        self.service_id = service_id
        self.name = name


class Appointment:
    SALON_OPEN = "08:00"
    SALON_CLOSE = "20:00"

    def __init__(
        self,
        appointment_id: int,
        client_name: str,
        master_id: int,
        service_id: int,
        time: str,
    ) -> None:
        self.id = appointment_id
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time

    @staticmethod
    def is_valid_time(time: str) -> bool:
        if not time or len(time) != 5 or time[2] != ":":
            return False
        hours, minutes = time[:2], time[3:]
        if not (hours.isdigit() and minutes.isdigit()):
            return False
        h, m = int(hours), int(minutes)
        if not (0 <= h <= 23 and 0 <= m <= 59):
            return False
        return Appointment.SALON_OPEN <= time <= Appointment.SALON_CLOSE


masters = [Master(1, "Анна"), Master(2, "Ольга")]
services = [Service(1, "Стрижка"), Service(2, "Маникюр")]
appointments: list[Appointment] = []


def get_master(master_id: int) -> Master | None:
    for master in masters:
        if master.master_id == master_id:
            return master
    return None


def get_service(service_id: int) -> Service | None:
    for service in services:
        if service.service_id == service_id:
            return service
    return None


def create_appointment(
    client_name: str,
    master_id: int,
    service_id: int,
    time: str,
) -> Appointment | None:
    if not client_name or not master_id or not service_id or not time:
        return None

    master = get_master(master_id)
    service = get_service(service_id)
    if master is None or service is None:
        return None

    if not Appointment.is_valid_time(time):
        return None

    for appointment in appointments:
        if appointment.master_id == master_id and appointment.time == time:
            return None

    appointment = Appointment(
        appointment_id=len(appointments) + 1,
        client_name=client_name,
        master_id=master.master_id,
        service_id=service.service_id,
        time=time,
    )
    appointments.append(appointment)
    return appointment


if __name__ == "__main__":
    # --- Задание 1 ---
    first = create_appointment("Иванова А.А.", 1, 1, "10:00")
    second = create_appointment("Петрова А.А.", 1, 1, "11:00")

    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)

    no_correct = create_appointment("", 1, 1, "12:00")
    assert no_correct is None
    print(f"\nПосле некорректной записи (пустое имя): {len(appointments)}")

    # --- Задание 2 ---
    bad_time = create_appointment("Сидорова А.А.", 1, 1, "00:00")
    assert bad_time is None
    print(f"После некорректного времени (00:00): {len(appointments)}")