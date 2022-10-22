<!doctype html>
<html>

<head>
	<?php require('_head.php') ?>
</head>

<body class="home--app">
	<?php require('_header.php') ?>
	<main>
		<section>
			<article>
				<p>Want a badge for a detail from your CI system?</p>
			</article>
		</section>
		<section>
			<article>
				<div class="getting-started">
					<h3>Getting Started!</h3>
					<a href="/github/login" class="github-login">Sign in with GitHub</a>
					<p>By clicking this button you consent to two cookies.</p>
					<hr />
					<p>One for the handshake with GitHub and the other holds and verifies the returned authentication.
					</p>
				</div>
			</article>
		</section>
		<section>
			<article>
				<h3>API Examples</h3>
				<div id="api-example"></div>
			</article>
		</section>
		<section>
			<article>
				<h3>Open Source</h3>
				<p>Want to run your own instance? The entire source code is availbile on GitHub.</p>
			</article>
		</section>
	</main>
	<script>
		document.addEventListener('DOMContentLoaded', function () {
			require(['shielded'], function (d) {  
				d.Home(document.getElementById('api-example'));
			});
		});
	</script>
	<?php require('_footer.php') ?>
</body>

</html>