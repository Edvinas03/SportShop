import { useForm } from "react-hook-form"
import { IStudent } from "../../../interfaces/IStudent";
import { useEffect } from "react";
import { formStyle } from "../../../styles/formStyle";

type StudentListProps = {
    students: IStudent[];
    setVisibleModal: (visible: boolean) => void;
};

export function StudentList(props: StudentListProps) {
    const { students, setVisibleModal } = props;

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vardas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pavardė</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">El. paštas</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">{students.map(student => (
                        <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.firstName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}