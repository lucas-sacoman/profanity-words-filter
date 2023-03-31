import { FormEvent, useState } from 'react';

function App() {
	const [inputValue, setInputValue] = useState('');
	const [finalText, setFinalText] = useState('');
	const [loading, setLoading] = useState(false);

	const prompt = `Observe se na seguinte sentença existe palavrões, até mesmo os abreviados em português. '${inputValue}'. Se sim, troque todos os palavrões por asteriscos. Senão, retorne 'false'`;

	const handleFetchGptData = (e: FormEvent) => {
		e.preventDefault();

		setLoading(true);

		fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${import.meta.env.VITE_CHAT_GPT_API_KEY}`,
			},
			body: JSON.stringify({
				prompt,
				model: 'text-davinci-003',
				temperature: 0,
				top_p: 0,
				max_tokens: 2048,
			}),
		})
			.then(response => response.json())
			.then(data => {
				const textWithoutBadWords = data.choices[0].text
					.split(',')
					.map((word: string) => word.replaceAll('\n', ''));

				setFinalText(textWithoutBadWords);
			})
			.catch(() => window.alert('Erro'))
			.finally(() => setLoading(false));
	};

	return (
		<main className="bg-slate-900 text-gray-50 flex flex-col justify-center items-center w-screen h-screen">
			<div className="flex flex-col justify-center items-center gap-4 w-full">
				<form
					className="flex flex-col justify-center items-center gap-4 w-full h-full"
					onSubmit={handleFetchGptData}
				>
					<textarea
						className="w-[400px] p-2 border text-slate-900"
						placeholder="Digite aqui seu texto"
						name="profanity"
						id="profanity"
						value={inputValue}
						onChange={e => setInputValue(e.target.value)}
					/>

					<button className="border px-4 py-2" type="submit">
						enviar
					</button>
				</form>

				<span className="mt-20">
					Texto final: {loading ? 'carregando...' : finalText}
				</span>
			</div>
		</main>
	);
}

export default App;
