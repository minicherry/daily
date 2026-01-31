export default function Card({ title, description }: { title: string, description: string }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-gray-700">{description}</p>
        </div>
    );
}