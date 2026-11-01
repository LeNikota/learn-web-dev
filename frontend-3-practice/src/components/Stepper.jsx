const Stepper = () => {
    const steps = [
        { id: 1, label: 'Специалист', status: 'complete' },
        { id: 2, label: 'Услуга', status: 'complete' },
        { id: 3, label: 'Дата и время', status: 'active' },
        { id: 4, label: 'Контактные данные', status: 'pending' },
        { id: 5, label: 'Проверка записи', status: 'pending' },
    ];

    return (
        <div className="stepper">
            {steps.map((step) => (
                <div
                    key={step.id}
                    className={`stepper__step stepper__step_${step.status}`}
                >
                    <div className="stepper__circle">{step.id}</div>
                    <span className="stepper__label">{step.label}</span>
                </div>
            ))}
        </div>
    );
};

export default Stepper;